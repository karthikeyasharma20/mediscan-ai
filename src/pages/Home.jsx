import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { FiUploadCloud, FiCpu, FiTrendingUp, FiActivity, FiShield, FiClock } from "react-icons/fi";

// Animated Counter component
function AnimatedCounter({ value, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, Math.max(stepTime, 20));

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function Home() {
  const navigate = useNavigate();

  // Floating shape variants
  const shapes = [
    { size: 120, top: "15%", left: "10%", delay: 0, color: "rgba(37, 99, 235, 0.1)" },
    { size: 180, top: "25%", right: "8%", delay: 2, color: "rgba(59, 130, 246, 0.08)" },
    { size: 100, bottom: "20%", left: "15%", delay: 4, color: "rgba(34, 197, 94, 0.06)" },
  ];

  const handleViewDemo = () => {
    // Navigate to analysis with a demo parameter
    navigate("/analysis?demo=true");
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1, overflowX: "hidden" }}>
      <Navbar />

      {/* Floating animations */}
      {shapes.map((s, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + idx * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            borderRadius: "40%",
            background: s.color,
            filter: "blur(20px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Hero Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px 100px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "60px",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
        className="hero-grid"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              background: "rgba(37, 99, 235, 0.1)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              color: "var(--primary)",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "24px",
            }}
          >
            <FiActivity /> Next-Gen AI Health Analytics
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              marginBottom: "24px",
            }}
          >
            Understand Medical Reports Using{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Artificial Intelligence
            </span>
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "18px",
              lineHeight: 1.6,
              marginBottom: "40px",
              maxWidth: "540px",
            }}
          >
            Upload blood reports, prescriptions, or lab reports and receive instant, secure AI-powered explanations in plain language.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              to="/upload"
              style={{
                padding: "16px 36px",
                borderRadius: "9999px",
                background: "var(--primary)",
                color: "white",
                fontWeight: 600,
                fontSize: "15px",
                boxShadow: "0 10px 20px rgba(37, 99, 235, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "transform 0.2s, background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.backgroundColor = "var(--primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.backgroundColor = "var(--primary)";
              }}
            >
              <FiUploadCloud size={18} />
              <span>Upload Report</span>
            </Link>

            <button
              onClick={handleViewDemo}
              style={{
                padding: "16px 36px",
                borderRadius: "9999px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                fontWeight: 600,
                fontSize: "15px",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "var(--border)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "var(--card-bg)";
              }}
            >
              View Demo
            </button>
          </div>
        </motion.div>

        {/* Hero Visual Graph SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
          className="hero-visual"
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              height: "380px",
              borderRadius: "24px",
              padding: "24px",
              position: "relative",
            }}
            className="glass-panel"
          >
            {/* Dynamic scanning grid grid lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                borderRadius: "24px",
              }}
            />

            {/* Glowing health vitals visualizer */}
            <svg
              viewBox="0 0 400 300"
              style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}
            >
              {/* Vitals Line */}
              <motion.path
                d="M 10 150 Q 80 150 110 150 T 130 90 T 150 210 T 170 150 Q 240 150 270 150 T 290 50 T 310 250 T 330 150 Q 370 150 390 150"
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Grid circle indicators */}
              <circle cx="140" cy="150" r="5" fill="#22c55e" />
              <circle cx="300" cy="150" r="5" fill="#ef4444" />
              <text x="150" y="145" fill="var(--text-secondary)" fontSize="10" fontFamily="sans-serif">Hemoglobin Norm</text>
              <text x="310" y="145" fill="var(--text-secondary)" fontSize="10" fontFamily="sans-serif">Glucose Alert</text>
            </svg>

            {/* floating overlay badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "-20px",
                padding: "16px",
                borderRadius: "16px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#22c55e",
                }}
              >
                <FiActivity size={20} />
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>Health Index</div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>98.4 Optimal</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto 120px",
          padding: "0 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>
            How MediScan AI Works
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
            Get a professional explanation of your health reports in three simple steps.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -8 }}
            style={{
              padding: "32px",
              borderRadius: "20px",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(37, 99, 235, 0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <FiUploadCloud size={24} />
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>1. Upload Report</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
              Drag and drop your PDF or image files. High-accuracy OCR instantly extracts key values and values automatically.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -8 }}
            style={{
              padding: "32px",
              borderRadius: "20px",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(59, 130, 246, 0.1)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <FiCpu size={24} />
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>2. AI Analysis</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
              Gemini AI models examine the report values, identifying abnormal elements and summarizing them in clear, educational language.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -8 }}
            style={{
              padding: "32px",
              borderRadius: "20px",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(34, 197, 94, 0.1)",
                color: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <FiTrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>3. Health Dashboard</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
              Track historical trends, review personalized risk distributions, download PDF summaries, and receive tailored wellness tips.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        style={{
          background: "var(--secondary)",
          color: "white",
          padding: "80px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "40px",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: "#60a5fa", marginBottom: "8px" }}>
              <AnimatedCounter value="1000" suffix="+" />
            </div>
            <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              Reports Analyzed
            </div>
          </div>

          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: "#22c55e", marginBottom: "8px" }}>
              <AnimatedCounter value="95" suffix="%" />
            </div>
            <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              Accuracy Score
            </div>
          </div>

          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: "#f59e0b", marginBottom: "8px" }}>
              <AnimatedCounter value="24" suffix="/7" />
            </div>
            <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              AI Smart Assistant
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ maxWidth: "1200px", margin: "100px auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 10 }}>
        <h3 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "32px" }}>
          Built with Trust & Security in Mind
        </h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", opacity: 0.7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
            <FiShield size={16} color="var(--primary)" /> 256-bit Encryption
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
            <FiClock size={16} color="var(--primary)" /> HIPAA Compliance Ready
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
            <FiCpu size={16} color="var(--primary)" /> Gemini Flash Engine
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            padding: 40px 24px 60px !important;
          }
          .hero-grid p {
            margin: 0 auto 30px !important;
          }
          .hero-grid div {
            justify-content: center !important;
          }
          .hero-visual {
            margin-top: 30px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;