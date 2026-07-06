import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIAssistant from "../components/AIAssistant";
import { useAuth } from "../hooks/AuthContext";
import { useToast } from "../hooks/ToastContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";
import { FiHeart, FiTrendingUp, FiActivity, FiDownload, FiShare2, FiAlertCircle, FiCheckSquare, FiInfo, FiFileText } from "react-icons/fi";

// Chart.js imports
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// High-fidelity Demo Report Data
const demoAnalysis = {
  healthScore: 78,
  riskLevel: "Medium",
  summary: "The laboratory blood report indicates mild Vitamin D3 deficiency and slightly elevated fasting blood glucose levels. Other core components, including hemoglobin and cholesterol ratios, remain within normal biological parameters. General dietary modifications and activity enhancements are advised to support metabolic control.",
  abnormalValues: [
    { test: "Vitamin D3", status: "Yellow", value: "18 ng/mL", range: "30 - 100 ng/mL" },
    { test: "Fasting Blood Sugar", status: "Red", value: "115 mg/dL", range: "70 - 99 mg/dL" },
    { test: "Total Cholesterol", status: "Yellow", value: "210 mg/dL", range: "< 200 mg/dL" },
    { test: "Hemoglobin", status: "Green", value: "14.2 g/dL", range: "13.5 - 17.5 g/dL" }
  ],
  suggestions: [
    "Supplement with 2,000 IU of Vitamin D3 daily or increase sunlight exposure.",
    "Adopt a low-glycemic index diet, prioritizing whole grains, fiber, and lean protein.",
    "Engage in moderate-intensity cardiovascular exercise for at least 150 minutes per week.",
    "Schedule a follow-up blood panel in 8 to 12 weeks to monitor glucose and Vitamin D levels."
  ]
};

function Analysis() {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyReports, setHistoryReports] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const printRef = useRef(null);

  const isDemo = searchParams.get("demo") === "true";

  // Fetch report data
  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        if (id) {
          // Fetch from Firestore
          const docRef = doc(db, "reports", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setReport({
              id: docSnap.id,
              reportName: data.reportName || "Medical Report",
              uploadDate: data.uploadDate || "Recent",
              healthScore: data.healthScore || 0,
              riskLevel: data.riskLevel || "Low",
              summary: data.summary || "",
              abnormalValues: data.abnormalValues || [],
              suggestions: data.suggestions || [],
              extractedText: data.extractedText || "",
            });
            // Initialize suggestions checklist
            if (data.suggestions) {
              setChecklist(new Array(data.suggestions.length).fill(false));
            }
          } else {
            showToast("Report not found in your database.", "error");
          }
        } else if (location.state && location.state.analysis) {
          // Loaded from Upload page router state
          const stateData = location.state;
          setReport({
            reportName: stateData.reportName || "Uploaded Report",
            uploadDate: new Date().toLocaleDateString(),
            healthScore: stateData.analysis.healthScore,
            riskLevel: stateData.analysis.riskLevel,
            summary: stateData.analysis.summary,
            abnormalValues: stateData.analysis.abnormalValues || [],
            suggestions: stateData.analysis.suggestions || [],
            extractedText: stateData.text || "",
          });
          if (stateData.analysis.suggestions) {
            setChecklist(new Array(stateData.analysis.suggestions.length).fill(false));
          }
        } else if (isDemo) {
          // Loaded via demo query string
          setReport({
            reportName: "Demo Blood Panel.pdf",
            uploadDate: new Date().toLocaleDateString(),
            healthScore: demoAnalysis.healthScore,
            riskLevel: demoAnalysis.riskLevel,
            summary: demoAnalysis.summary,
            abnormalValues: demoAnalysis.abnormalValues,
            suggestions: demoAnalysis.suggestions,
            extractedText: "DEMO TEST REPORT\nPATIENT: JOHN DOE\nVitamin D3: 18 ng/mL (Low)\nFasting Blood Sugar: 115 mg/dL (High)\nTotal Cholesterol: 210 mg/dL (Borderline High)\nHemoglobin: 14.2 g/dL (Normal)",
          });
          setChecklist(new Array(demoAnalysis.suggestions.length).fill(false));
        } else if (user) {
          // If logged in and page is blank, load their most recent report automatically
          const reportsRef = collection(db, "reports");
          const q = query(
            reportsRef,
            where("uid", "==", user.uid),
            orderBy("timestamp", "desc")
          );
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            const latestDoc = querySnap.docs[0];
            const data = latestDoc.data();
            setReport({
              id: latestDoc.id,
              reportName: data.reportName,
              uploadDate: data.uploadDate,
              healthScore: data.healthScore,
              riskLevel: data.riskLevel,
              summary: data.summary,
              abnormalValues: data.abnormalValues || [],
              suggestions: data.suggestions || [],
              extractedText: data.extractedText || "",
            });
            if (data.suggestions) {
              setChecklist(new Array(data.suggestions.length).fill(false));
            }
          }
        }
      } catch (err) {
        console.error(err);
        showToast("Error loading health analysis.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id, location.state, isDemo, user]);

  // Fetch report history for plotting trends
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "reports"),
          where("uid", "==", user.uid),
          orderBy("timestamp", "asc")
        );
        const querySnap = await getDocs(q);
        const list = [];
        querySnap.forEach((doc) => {
          const d = doc.data();
          list.push({
            date: d.uploadDate || "Previous",
            score: d.healthScore || 0,
            risk: d.riskLevel || "Low",
          });
        });
        setHistoryReports(list);
      } catch (err) {
        console.error("Error loading historical metrics:", err);
      }
    };
    fetchHistory();
  }, [user, report]);

  const handleToggleChecklist = (idx) => {
    setChecklist((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    showToast("Analysis link copied to clipboard!", "success");
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "var(--background)" }}>
          <div className="pulse-glow" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)" }} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <FiAlertCircle size={48} color="var(--primary)" style={{ marginBottom: "20px" }} />
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>No Analysis Available</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "480px" }}>
            Please upload a medical report first to view the dynamic dashboard results.
          </p>
          <Link to="/upload" style={{ padding: "14px 28px", background: "var(--primary)", color: "white", borderRadius: "8px", fontWeight: 600 }}>
            Upload Medical Report
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate SVGs circular meter values
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.healthScore / 100) * circumference;

  // Chart 1: Health Score Trend Data (Bar Chart)
  let trendLabels = ["Jan", "Feb", "Mar", "Current"];
  let trendData = [65, 70, 72, report.healthScore];
  
  if (historyReports.length > 1) {
    trendLabels = historyReports.map((r) => r.date.split(",")[0]); // get month/day
    trendData = historyReports.map((r) => r.score);
  }

  const barChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Health Score",
        data: trendData,
        backgroundColor: "rgba(37, 99, 235, 0.75)",
        borderColor: "var(--primary)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Chart 2: Blood Components Status Data (Doughnut Chart)
  let normalCount = report.abnormalValues.filter((v) => v.status === "Green").length;
  let warnCount = report.abnormalValues.filter((v) => v.status === "Yellow").length;
  let criticalCount = report.abnormalValues.filter((v) => v.status === "Red").length;
  
  if (normalCount === 0 && warnCount === 0 && criticalCount === 0) {
    // defaults if none mapped
    normalCount = 4;
    warnCount = 2;
    criticalCount = 1;
  }

  const doughnutData = {
    labels: ["Optimal", "Warning", "Critical"],
    datasets: [
      {
        data: [normalCount, warnCount, criticalCount],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  // Chart 3: Risk Level Distribution Data (Line Chart)
  let riskLabels = ["Point 1", "Point 2", "Point 3", "Current"];
  let riskData = [1, 2, 2, report.riskLevel === "Low" ? 1 : report.riskLevel === "Medium" ? 2 : 3];

  if (historyReports.length > 1) {
    riskLabels = historyReports.map((r) => r.date.split(",")[0]);
    riskData = historyReports.map((r) => (r.risk === "Low" ? 1 : r.risk === "Medium" ? 2 : 3));
  }

  const lineChartData = {
    labels: riskLabels,
    datasets: [
      {
        label: "Risk Index",
        data: riskData,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        borderColor: "var(--primary)",
        borderWidth: 3,
        pointBackgroundColor: "var(--primary)",
        pointHoverRadius: 7,
        tension: 0.3,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 1,
        max: 3,
        ticks: {
          callback: (value) => (value === 1 ? "Low" : value === 2 ? "Med" : "High"),
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} ref={printRef}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 24px", position: "relative", zIndex: 10 }} className="print-container">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Dashboard Title & Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "20px",
            }}
            className="dashboard-header"
          >
            <div>
              <div style={{ fontSize: "14px", color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                <FiActivity /> Dashboard Results
              </div>
              <h1 style={{ fontSize: "32px", fontWeight: 700, marginTop: "4px" }}>
                {report.reportName}
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "2px" }}>
                Analyzed on {report.uploadDate} {!user && <span style={{ color: "var(--warning)" }}>(Guest Mode)</span>}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }} className="header-actions">
              <button
                onClick={handleShare}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--card-bg)'}
              >
                <FiShare2 /> Share
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--primary)'}
              >
                <FiDownload /> Download PDF
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "30px",
            }}
            className="dashboard-grid"
          >
            {/* Left Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              
              {/* Health Score & Risk Level */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
                className="stats-grid"
              >
                {/* Health Score Circular SVG Meter */}
                <div
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "20px",
                    padding: "24px",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "16px", alignSelf: "flex-start" }}>
                    Health Index
                  </h3>
                  
                  <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "12px" }}>
                    <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      <circle cx="60" cy="60" r="52" fill="none" stroke="var(--background)" strokeWidth="8" />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: "24px", fontWeight: 700 }}>{report.healthScore}</span>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>OPTIMAL</span>
                    </div>
                  </div>
                </div>

                {/* Risk Level Box */}
                <div
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "20px",
                    padding: "24px",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                    Risk Assessment
                  </h3>
                  
                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 20px",
                        borderRadius: "9999px",
                        fontSize: "20px",
                        fontWeight: 700,
                        background:
                          report.riskLevel === "Low"
                            ? "rgba(34, 197, 94, 0.15)"
                            : report.riskLevel === "Medium"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color:
                          report.riskLevel === "Low"
                            ? "var(--success)"
                            : report.riskLevel === "Medium"
                            ? "var(--warning)"
                            : "var(--danger)",
                      }}
                    >
                      <FiHeart fill={report.riskLevel === "Low" ? "var(--success)" : report.riskLevel === "Medium" ? "var(--warning)" : "var(--danger)"} size={16} />
                      {report.riskLevel} Risk
                    </span>
                  </div>

                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px" }}>
                    Calculated relative to standardized reference bounds and patient age parameters.
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FiInfo color="var(--primary)" /> Medical Summary
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {report.summary}
                </p>
              </div>

              {/* Suggestions Recommendations */}
              <div
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FiCheckSquare color="var(--primary)" /> Recommendations Plan
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {report.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleToggleChecklist(idx)}
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "14px 18px",
                        borderRadius: "10px",
                        background: checklist[idx] ? "rgba(34, 197, 94, 0.05)" : "var(--background)",
                        border: checklist[idx] ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid var(--border)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checklist[idx] || false}
                        onChange={() => {}} // handled by parent wrapper click
                        style={{ width: "16px", height: "16px", accentColor: "var(--success)", cursor: "pointer", marginTop: "2px" }}
                      />
                      <span
                        style={{
                          fontSize: "13px",
                          color: checklist[idx] ? "var(--text-muted)" : "var(--text-main)",
                          textDecoration: checklist[idx] ? "line-through" : "none",
                          lineHeight: 1.4,
                        }}
                      >
                        {suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              
              {/* Interactive Charts Panel */}
              <div
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "var(--shadow-sm)",
                }}
                className="charts-container"
              >
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FiTrendingUp color="var(--primary)" /> Health Trend Visualizer
                </h3>

                {/* Health Score Bar Chart */}
                <div style={{ marginBottom: "32px", height: "180px", position: "relative" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Health Score Progress</div>
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { min: 0, max: 100 } }
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "16px" }} className="subcharts-grid">
                  {/* Blood Component Status Doughnut */}
                  <div style={{ height: "140px", position: "relative" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>Test Status Ratio</div>
                    <Doughnut
                      data={doughnutData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  </div>

                  {/* Risk Line Chart */}
                  <div style={{ height: "140px", position: "relative" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>Risk Index History</div>
                    <Line data={lineChartData} options={lineChartOptions} />
                  </div>
                </div>
              </div>

              {/* Abnormal Values Indicators */}
              <div
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
                  Lab Findings & Flagged Levels
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {report.abnormalValues.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "14px 18px",
                        borderRadius: "10px",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600 }}>{item.test}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          Reference range: {item.range}
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                          {item.value}
                        </div>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            background:
                              item.status === "Green"
                                ? "rgba(34, 197, 94, 0.12)"
                                : item.status === "Yellow"
                                ? "rgba(245, 158, 11, 0.12)"
                                : "rgba(239, 68, 68, 0.12)",
                            color:
                              item.status === "Green"
                                ? "var(--success)"
                                : item.status === "Yellow"
                                ? "var(--warning)"
                                : "var(--danger)",
                          }}
                        >
                          {item.status === "Green" ? "Normal" : item.status === "Yellow" ? "Borderline" : "Critical"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw OCR Text logs (collapsible drawer) */}
              {report.extractedText && (
                <div
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "20px",
                    padding: "24px",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  className="ocr-text-box"
                >
                  <details style={{ width: "100%" }}>
                    <summary style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", outline: "none", userSelect: "none" }}>
                      <FiFileText style={{ marginRight: "6px" }} /> View Raw Extracted Text Logs
                    </summary>
                    <div style={{ marginTop: "16px", padding: "12px", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "8px", overflowX: "auto" }}>
                      <pre style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                        {report.extractedText}
                      </pre>
                    </div>
                  </details>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* Floating AI Assistant Chat drawer */}
      <AIAssistant reportName={report.reportName} analysis={report} />

      <Footer />

      {/* Print Specific CSS Styles override */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, .header-actions, .ocr-text-box, .ai-assistant-btn, .ai-assistant-drawer {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .dashboard-header {
            margin-bottom: 20px !important;
          }
          .dashboard-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .glass-panel, .glass-card {
            border: 1px solid #ccc !important;
            background: white !important;
            box-shadow: none !important;
          }
        }
        @media (max-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .subcharts-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Analysis;