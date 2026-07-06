import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { useToast } from "../hooks/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

function Register() {
  const { register, googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState({ score: 0, text: "Very Weak", color: "var(--danger)" });
  const [loading, setLoading] = useState(false);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, text: "Empty", color: "var(--border)" });
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let text = "Very Weak";
    let color = "var(--danger)";
    if (score === 2) {
      text = "Weak";
      color = "#f87171";
    } else if (score === 3) {
      text = "Medium";
      color = "var(--warning)";
    } else if (score >= 4) {
      text = "Strong";
      color = "var(--success)";
    }

    setStrength({ score, text, color });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast("Please fill in all fields", "warning");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "warning");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      showToast("Registration successful! Welcome to MediScan AI.", "success");
      navigate("/upload");
    } catch (error) {
      console.error(error);
      let errorMsg = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Please enter a valid email address.";
      }
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleLogin();
      showToast("Signed in with Google!", "success");
      navigate("/upload");
    } catch (error) {
      console.error(error);
      showToast("Google Sign-In failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: "960px",
            width: "100%",
            borderRadius: "24px",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            boxShadow: "var(--shadow-xl)",
          }}
          className="glass-panel"
        >
          {/* Left panel - illustration/info */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
              color: "white",
              padding: "48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
            className="login-side-panel"
          >
            {/* Visual design grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(rgba(59,130,246,0.15) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                opacity: 0.8,
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: "28px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🏥</span> MediScan AI
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 600, lineHeight: 1.3, marginBottom: "16px", color: "#60a5fa" }}>
                Join the Health Revolution
              </h2>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.7)", marginBottom: "24px" }}>
                Create a free account to automatically keep records of all analyzed medical reports. Access advanced diagnostic explanation logs and visualize trends anytime.
              </p>
            </div>

            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                🔒 HIPAA Compliant and 100% Secure.
              </div>
            </div>
          </div>

          {/* Right panel - form */}
          <div
            style={{
              padding: "48px",
              background: "var(--card-bg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Create Account</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
              Get started with MediScan AI for free.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Full Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <FiUser
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 42px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <FiMail
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                    }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 42px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <FiLock
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                    }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 42px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    required
                  />
                </div>
                {/* Password Strength Indicator */}
                {password && (
                  <div style={{ marginTop: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Password Strength:</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: strength.color }}>{strength.text}</span>
                    </div>
                    <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(strength.score / 5) * 100}%`,
                          background: strength.color,
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <FiLock
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                    }}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 42px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--text-main)",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                  opacity: loading ? 0.7 : 1,
                  pointerEvents: loading ? "none" : "auto",
                  marginTop: "8px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
              >
                <span>{loading ? "Creating Account..." : "Register"}</span>
                {!loading && <FiArrowRight />}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", margin: "6px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                <span style={{ padding: "0 12px", fontSize: "11px", color: "var(--text-muted)" }}>or register with</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text-main)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "var(--shadow-sm)",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card-bg)")}
              >
                <FcGoogle size={18} />
                <span>Google Account</span>
              </button>

              {/* Redirect to login */}
              <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .login-side-panel {
            display: none !important;
          }
          .glass-panel {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;
