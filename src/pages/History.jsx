import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/AuthContext";
import { useToast } from "../hooks/ToastContext";
import { db } from "../firebase/firebase";
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCalendar, FiTrash2, FiEye, FiDownload, FiFolderMinus, FiActivity } from "react-icons/fi";

function History() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchReports = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "reports"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      const list = [];
      querySnap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setReports(list);
    } catch (err) {
      console.error(err);
      showToast("Error retrieving records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleDelete = async (reportId, reportScore, e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this report from your history?")) {
      return;
    }

    try {
      // Delete document
      await deleteDoc(doc(db, "reports", reportId));
      showToast("Report deleted successfully.", "success");

      // Filter local list
      const updatedList = reports.filter((r) => r.id !== reportId);
      setReports(updatedList);

      // Recalculate user statistics
      let newCount = updatedList.length;
      let newAvg = 0;
      if (newCount > 0) {
        const sum = updatedList.reduce((acc, curr) => acc + (curr.healthScore || 0), 0);
        newAvg = Math.round(sum / newCount);
      }

      await updateDoc(doc(db, "users", user.uid), {
        reportsCount: newCount,
        avgHealthScore: newAvg,
      });

    } catch (err) {
      console.error(err);
      showToast("Could not delete report.", "error");
    }
  };

  const handleDownload = (report, e) => {
    e.stopPropagation();
    e.preventDefault();
    // Redirect to analysis page print view
    navigate(`/analysis/${report.id}`);
    setTimeout(() => {
      window.print();
    }, 800);
  };

  // Filter reports list based on search and date inputs
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.reportName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter) {
      // Compare dates (YYYY-MM-DD or standard locales)
      const reportDate = new Date(report.uploadDate);
      const filterDate = new Date(dateFilter);
      matchesDate =
        reportDate.getFullYear() === filterDate.getFullYear() &&
        reportDate.getMonth() === filterDate.getMonth() &&
        reportDate.getDate() === filterDate.getDate();
    }
    
    return matchesSearch && matchesDate;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* Header */}
          <div style={{ marginBottom: "36px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>Report History</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
              Access, visualize, and manage all your previously analyzed health reports.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}
          >
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
              <FiSearch
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Search reports by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text-main)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            {/* Date Input */}
            <div style={{ minWidth: "200px", position: "relative" }}>
              <FiCalendar
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text-main)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Records List Container */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div className="pulse-glow" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", margin: "0 auto" }} />
            </div>
          ) : filteredReports.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              <AnimatePresence>
                {filteredReports.map((report) => (
                  <motion.div
                    key={report.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "16px",
                      padding: "20px",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top Section */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                          {report.reportName}
                        </h3>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            background:
                              report.riskLevel === "Low"
                                ? "rgba(34, 197, 94, 0.12)"
                                : report.riskLevel === "Medium"
                                ? "rgba(245, 158, 11, 0.12)"
                                : "rgba(239, 68, 68, 0.12)",
                            color:
                              report.riskLevel === "Low"
                                ? "var(--success)"
                                : report.riskLevel === "Medium"
                                ? "var(--warning)"
                                : "var(--danger)",
                          }}
                        >
                          {report.riskLevel}
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "12px", marginBottom: "20px" }}>
                        <FiCalendar /> {report.uploadDate}
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FiActivity color="var(--primary)" />
                        <span style={{ fontSize: "16px", fontWeight: 700 }}>{report.healthScore}</span>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>INDEX</span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={(e) => handleDelete(report.id, report.healthScore, e)}
                          title="Delete report"
                          style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            background: "rgba(239, 68, 68, 0.08)",
                            color: "var(--danger)",
                            cursor: "pointer",
                            display: "flex",
                          }}
                        >
                          <FiTrash2 size={15} />
                        </button>
                        <button
                          onClick={(e) => handleDownload(report, e)}
                          title="Download PDF"
                          style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            background: "rgba(37, 99, 235, 0.08)",
                            color: "var(--primary)",
                            cursor: "pointer",
                            display: "flex",
                          }}
                        >
                          <FiDownload size={15} />
                        </button>
                        <Link
                          to={`/analysis/${report.id}`}
                          title="View analysis dashboard"
                          style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "none",
                            background: "var(--primary)",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          <FiEye size={13} />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <FiFolderMinus size={48} color="var(--text-muted)" style={{ marginBottom: "16px", opacity: 0.6 }} />
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>No Reports Found</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px", maxWidth: "380px", margin: "0 auto 24px" }}>
                {searchTerm || dateFilter
                  ? "We couldn't find any reports matching your active filters. Try adjusting your search."
                  : "You haven't uploaded or analyzed any medical reports yet. Start by uploading one."}
              </p>
              {!searchTerm && !dateFilter && (
                <Link to="/upload" style={{ padding: "12px 24px", background: "var(--primary)", color: "white", borderRadius: "8px", fontWeight: 600 }}>
                  Upload Report
                </Link>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default History;