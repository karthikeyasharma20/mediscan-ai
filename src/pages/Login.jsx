import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { useToast } from "../hooks/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiShieldAlert } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Login() {
  const { login, googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast("Logged in successfully!", "success");
      navigate("/upload");
    } catch (error) {
      console.error(error);
      let errorMsg = "Invalid email or password.";
      if (error.code === "auth/user-not-found") errorMsg = "Account not found.";
      if (error.code === "auth/wrong-password") errorMsg = "Incorrect password.";
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

  const handleForgotPassword = async () => {
    if (!email) {
      showToast("Please enter your email address first", "warning");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent! Check your inbox.", "success");
    } catch (error) {
      console.error(error);
      showToast("Could not send password reset email.", "error");
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
                Your Intelligent Healthcare Portal
              </h2>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.7)", marginBottom: "24px" }}>
                Securely store analyzed results, follow key wellness indexes, track longitudinal blood panels, and collaborate with your medical provider.
              </p>
            </div>

            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                🔐 Secured with HIPAA standard level encryption.
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
            <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Welcome Back</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "32px" }}>
              Sign in to manage your medical history.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Email Address</label>
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
                      padding: "12px 14px 12px 42px",
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
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
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
                      padding: "12px 14px 12px 42px",
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
                  padding: "14px",
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
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
              >
                <span>{loading ? "Signing in..." : "Login"}</span>
                {!loading && <FiArrowRight />}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                <span style={{ padding: "0 12px", fontSize: "12px", color: "var(--text-muted)" }}>or continue with</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
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

              {/* Redirect to signup */}
              <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-secondary)", marginTop: "12px" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
                  Register here
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

export default Login;
