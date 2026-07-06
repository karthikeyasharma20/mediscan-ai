import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { useTheme } from "../hooks/ThemeContext";
import { useToast } from "../hooks/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut } from "react-icons/fi";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully", "success");
      navigate("/");
    } catch (error) {
      showToast("Error logging out", "error");
    }
  };

  const isActive = (path) => {
    if (path === "/analysis" && location.pathname.startsWith("/analysis")) {
      return true;
    }
    return location.pathname === path;
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Upload", path: "/upload" },
    { label: "Dashboard", path: "/analysis" },
    ...(user
      ? [
          { label: "History", path: "/history" },
          { label: "Profile", path: "/profile" },
        ]
      : []),
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: scrolled
          ? "var(--glass-bg)"
          : "linear-gradient(to bottom, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.85))",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: scrolled ? "var(--shadow-md)" : "none",
        padding: scrolled ? "12px 40px" : "18px 40px",
        color: scrolled && theme === "light" ? "var(--text-main)" : "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: "22px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: scrolled && theme === "light" ? "var(--primary)" : "#60a5fa",
          }}
        >
          <span>🏥</span>
          <span style={{ letterSpacing: "-0.5px" }}>MediScan AI</span>
        </Link>

        {/* Desktop Menu */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
          className="desktop-menu"
        >
          <nav
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  position: "relative",
                  color: isActive(item.path)
                    ? scrolled && theme === "light"
                      ? "var(--primary)"
                      : "#ffffff"
                    : scrolled && theme === "light"
                    ? "var(--text-secondary)"
                    : "rgba(255, 255, 255, 0.7)",
                  background: isActive(item.path)
                    ? scrolled && theme === "light"
                      ? "rgba(37, 99, 235, 0.1)"
                      : "rgba(59, 130, 246, 0.2)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = scrolled && theme === "light"
                      ? "rgba(15, 23, 42, 0.05)"
                      : "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.color = scrolled && theme === "light"
                      ? "var(--text-main)"
                      : "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = scrolled && theme === "light"
                      ? "var(--text-secondary)"
                      : "rgba(255, 255, 255, 0.7)";
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            style={{
              height: "20px",
              width: "1px",
              background: scrolled && theme === "light" ? "var(--border)" : "rgba(255, 255, 255, 0.15)",
            }}
          />

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: scrolled && theme === "light" ? "var(--text-main)" : "white",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = scrolled && theme === "light"
                  ? "rgba(15, 23, 42, 0.05)"
                  : "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
              title="Toggle Theme"
            >
              {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: scrolled && theme === "light" ? "var(--text-main)" : "white",
                  }}
                >
                  {user.name || user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    background: "var(--danger)",
                    color: "white",
                    fontWeight: 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)",
                  }}
                >
                  <FiLogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  background: scrolled && theme === "light" ? "var(--primary)" : "#60a5fa",
                  color: scrolled && theme === "light" ? "white" : "var(--secondary)",
                  fontWeight: 600,
                  fontSize: "13px",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: scrolled && theme === "light" ? "var(--text-main)" : "white",
            display: "none",
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              background: "var(--card-bg)",
              borderTop: "1px solid var(--border)",
              marginTop: scrolled ? "12px" : "18px",
              padding: "16px 0 24px",
              gap: "16px",
              color: "var(--text-main)",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  padding: "8px 40px",
                  color: isActive(item.path) ? "var(--primary)" : "var(--text-secondary)",
                }}
              >
                {item.label}
              </Link>
            ))}

            <div style={{ padding: "0 40px", display: "flex", gap: "16px", alignItems: "center" }}>
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "var(--text-main)",
                  fontSize: "14px",
                }}
              >
                {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: "var(--danger)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    background: "var(--primary)",
                    color: "white",
                    borderRadius: "8px",
                    padding: "8px 24px",
                    fontWeight: 600,
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Navbar;