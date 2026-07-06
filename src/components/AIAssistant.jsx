import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiLoader } from "react-icons/fi";
import axios from "axios";

function AIAssistant({ reportName, analysis }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I'm your MediScan AI Health Assistant. Ask me anything about your report "${reportName}" or the suggested recommendations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Build context from analysis
      const contextText = `
        Report Name: ${reportName}
        Health Score: ${analysis.healthScore}/100
        Risk Level: ${analysis.riskLevel}
        Summary: ${analysis.summary}
        Abnormal Values: ${JSON.stringify(analysis.abnormalValues)}
        Suggestions: ${JSON.stringify(analysis.suggestions)}
      `;

      const response = await axios.post("http://localhost:5000/api/chat", {
        context: contextText,
        message: input,
        history: messages.map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        })),
      });

      const aiResponseText = response.data.answer;

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 999,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="ai-assistant-btn"
      >
        <FiMessageSquare size={24} />
      </motion.button>

      {/* Slide-out Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(4px)",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "100%",
                background: "var(--card-bg)",
                borderLeft: "1px solid var(--border)",
                boxShadow: "var(--shadow-xl)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
              className="ai-assistant-drawer"
            >
              {/* Header */}
              <div
                style={{
                  padding: "20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "linear-gradient(to right, #1e3a8a, #0f172a)",
                  color: "white",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>
                    🏥 MediScan Assistant
                  </h3>
                  <p style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)" }}>
                    Ask about {reportName}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Chat Log */}
              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  background: "var(--background)",
                }}
              >
                {messages.map((m, idx) => {
                  const isUser = m.sender === "user";
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: isUser ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "80%",
                          padding: "12px 16px",
                          borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                          background: isUser ? "var(--primary)" : "var(--card-bg)",
                          color: isUser ? "white" : "var(--text-main)",
                          boxShadow: "var(--shadow-sm)",
                          border: isUser ? "none" : "1px solid var(--border)",
                          fontSize: "13px",
                          lineHeight: 1.5,
                        }}
                      >
                        <div>{m.text}</div>
                        <div
                          style={{
                            fontSize: "9px",
                            textAlign: "right",
                            marginTop: "4px",
                            color: isUser ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
                          }}
                        >
                          {m.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px 16px 16px 2px",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FiLoader className="spin" size={16} color="var(--primary)" />
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>AI is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSend}
                style={{
                  padding: "16px",
                  borderTop: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a health question..."
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "20px",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--text-main)",
                    outline: "none",
                    fontSize: "13px",
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)",
                    opacity: !input.trim() || loading ? 0.6 : 1,
                  }}
                >
                  <FiSend size={16} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default AIAssistant;
