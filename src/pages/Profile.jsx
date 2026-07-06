import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/AuthContext";
import { useToast } from "../hooks/ToastContext";
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiCalendar, FiActivity, FiLayers, FiSave, FiLogOut } from "react-icons/fi";

function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || user?.displayName || "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully", "success");
      navigate("/");
    } catch (error) {
      showToast("Error logging out", "error");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name cannot be empty", "warning");
      return;
    }

    setSaving(true);
    try {
      // 1. Update Firebase Auth Profile
      if (user.auth) {
        await updateProfile(user.auth, { displayName: name });
      }
      
      // 2. Update Firestore User Document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: name,
      });

      showToast("Profile updated successfully!", "success");
      setEditing(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  // Get user initials for avatar
  const getInitials = () => {
    const userDisplayName = user.name || user.displayName || "";
    if (!userDisplayName) return "U";
    const parts = userDisplayName.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "60px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          {/* Profile Card Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "40px",
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              gap: "32px",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}
            className="profile-card"
          >
            {/* Initials Avatar */}
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                color: "white",
                fontSize: "32px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)",
              }}
            >
              {getInitials()}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.2 }}>
                    {user.name || user.displayName || "MediScan User"}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FiMail /> {user.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "rgba(239, 68, 68, 0.05)",
                    color: "var(--danger)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--danger)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
                    e.currentTarget.style.color = "var(--danger)";
                  }}
                >
                  <FiLogOut /> Log Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            {/* Reports Count Card */}
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.1)", color: "var(--primary)" }}>
                <FiLayers size={22} />
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 700 }}>{user.reportsCount || 0}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Reports Analyzed</div>
              </div>
            </div>

            {/* Average Score Card */}
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(34, 197, 94, 0.1)", color: "var(--success)" }}>
                <FiActivity size={22} />
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 700 }}>{user.avgHealthScore || 0}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Average Health Score</div>
              </div>
            </div>

            {/* Member Since Card */}
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)", color: "var(--warning)" }}>
                <FiCalendar size={22} />
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>{user.memberSince || "Recent"}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Member Since</div>
              </div>
            </div>
          </div>

          {/* Edit Settings Container */}
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px" }}>Account Settings</h3>

            {!editing ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Full Name</span>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-main)", marginTop: "4px" }}>
                      {user.name || user.displayName || "Not set"}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--text-main)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>

                <div style={{ padding: "16px 0 0" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Email Address</span>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-secondary)", marginTop: "4px" }}>
                    {user.email} (Email login cannot be modified)
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Update Full Name</label>
                  <div style={{ position: "relative" }}>
                    <FiUser style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        background: "var(--background)",
                        color: "var(--text-main)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setName(user.name || user.displayName || "");
                      setEditing(false);
                    }}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--text-main)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "none",
                      background: "var(--primary)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
                    }}
                  >
                    <FiSave />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 600px) {
          .profile-card {
            flex-direction: column !important;
            text-align: center !important;
            padding: 24px !important;
          }
          .profile-card button {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
