import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UploadBox from "../components/UploadBox";
import { useAuth } from "../hooks/AuthContext";
import { useToast } from "../hooks/ToastContext";
import { extractText } from "../services/ocrService";
import { analyzeMedicalReport } from "../services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader, FiAlertTriangle, FiFileText } from "react-icons/fi";
import { db } from "../firebase/firebase";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

function Upload() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Reading report...", progress: 25 },
    { label: "Extracting text...", progress: 50 },
    { label: "Analyzing with AI...", progress: 75 },
    { label: "Generating dashboard...", progress: 95 },
  ];

  const handleAnalyze = async () => {
    if (!file) {
      showToast("Please select a medical report first.", "warning");
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    try {
      // Step 1: Reading report (simulation delay for file buffering)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 2: OCR text extraction
      setCurrentStep(1);
      const text = await extractText(file);
      if (!text || text.trim() === "") {
        throw new Error("Unable to extract text. Please ensure the document is clear.");
      }

      // Step 3: AI analysis with Gemini
      setCurrentStep(2);
      const aiResult = await analyzeMedicalReport(text);
      if (!aiResult) {
        throw new Error("Gemini AI failed to analyze this report.");
      }

      // Step 4: Generating dashboard & database write
      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 800));

      let reportId = null;
      if (user) {
        // Save report to Firestore
        const docRef = await addDoc(collection(db, "reports"), {
          uid: user.uid,
          reportName: file.name,
          uploadDate: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          timestamp: serverTimestamp(),
          extractedText: text,
          healthScore: aiResult.healthScore,
          riskLevel: aiResult.riskLevel,
          summary: aiResult.summary,
          abnormalValues: aiResult.abnormalValues || [],
          suggestions: aiResult.suggestions || [],
        });
        reportId = docRef.id;

        // Update user aggregate stats in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const newCount = (userData.reportsCount || 0) + 1;
          const oldAvg = userData.avgHealthScore || 0;
          const newAvg = Math.round(
            ((oldAvg * (newCount - 1)) + aiResult.healthScore) / newCount
          );
          await updateDoc(userRef, {
            reportsCount: newCount,
            avgHealthScore: newAvg,
          });
        }
      }

      showToast("Analysis complete!", "success");

      // Redirect to Analysis Page
      if (reportId) {
        navigate(`/analysis/${reportId}`);
      } else {
        // Guest redirection with state values
        navigate("/analysis", {
          state: {
            analysis: aiResult,
            text: text,
            reportName: file.name,
          },
        });
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || "Failed to analyze the medical report.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "60px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "12px" }}>
              Analyze Medical Report
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
              Upload your laboratory tests, blood report panels, or prescriptions.
            </p>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: "24px" }}
              >
                {/* Drag-and-drop workspace */}
                <UploadBox
                  selectedFile={file}
                  setFile={setFile}
                />

                {/* Upload Action */}
                {file && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      background: "rgba(37, 99, 235, 0.05)",
                      border: "1px solid rgba(37, 99, 235, 0.15)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <FiFileText size={20} color="var(--primary)" />
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>Ready to analyze: {file.name}</div>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      style={{
                        padding: "12px 28px",
                        borderRadius: "8px",
                        border: "none",
                        background: "var(--primary)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
                    >
                      Analyze Report
                    </button>
                  </motion.div>
                )}

                {/* Disclaimer box */}
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "20px",
                    borderRadius: "16px",
                    background: "rgba(245, 158, 11, 0.06)",
                    border: "1px solid rgba(245, 158, 11, 0.15)",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ flexShrink: 0, color: "var(--warning)", marginTop: "2px" }}>
                    <FiAlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", marginBottom: "4px" }}>
                      Medical Education Disclaimer
                    </h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      MediScan AI provides educational summaries of medical reports only and is not intended to replace professional healthcare consultations, diagnostics, or treatments.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Stepper progress indicator
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: "48px 32px",
                  borderRadius: "24px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-lg)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Loader spinner */}
                <div style={{ marginBottom: "32px", position: "relative" }}>
                  <FiLoader
                    size={48}
                    color="var(--primary)"
                    style={{
                      animation: "spin 2s linear infinite",
                    }}
                  />
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>

                <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
                  Analyzing Your Report
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "36px" }}>
                  Our AI engine is processing your record. This takes just a moment.
                </p>

                {/* Progress bar */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "6px",
                    background: "var(--background)",
                    borderRadius: "3px",
                    overflow: "hidden",
                    marginBottom: "24px",
                  }}
                >
                  <motion.div
                    animate={{ width: `${steps[currentStep].progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: "var(--primary)",
                      borderRadius: "3px",
                    }}
                  />
                </div>

                {/* Status stepper text labels */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "100%",
                    maxWidth: "320px",
                    textAlign: "left",
                  }}
                >
                  {steps.map((step, idx) => {
                    const isDone = idx < currentStep;
                    const isActive = idx === currentStep;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          opacity: isDone || isActive ? 1 : 0.35,
                          transition: "opacity 0.3s",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: isDone
                              ? "var(--success)"
                              : isActive
                              ? "var(--primary)"
                              : "var(--border)",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? "var(--primary)" : "var(--text-main)",
                          }}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Upload;