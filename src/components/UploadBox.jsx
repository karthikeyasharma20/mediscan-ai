import React from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";

function UploadBox({ setFile, setText, setAnalysis, selectedFile }) {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      if (setText) setText("");
      if (setAnalysis) setAnalysis("");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: false,
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      {...getRootProps()}
      style={{
        border: isDragActive ? "2px dashed var(--primary)" : "2px dashed var(--border)",
        borderRadius: "20px",
        padding: "60px 40px",
        textAlign: "center",
        cursor: "pointer",
        background: isDragActive ? "rgba(37, 99, 235, 0.04)" : "var(--card-bg)",
        boxShadow: isDragActive ? "0 0 20px rgba(37, 99, 235, 0.1)" : "var(--shadow-sm)",
        transition: "all 0.2s ease-in-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <input {...getInputProps()} />

      {/* Floating grid backgrounds */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div
          animate={isDragActive ? { y: [0, -10, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: isDragActive ? "rgba(37, 99, 235, 0.15)" : "var(--background)",
            color: isDragActive ? "var(--primary)" : "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {selectedFile ? <FiFileText size={28} color="var(--primary)" /> : <FiUploadCloud size={28} />}
        </motion.div>

        {selectedFile ? (
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "var(--primary)" }}>
              File Selected
            </h3>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-main)", marginBottom: "4px" }}>
              {selectedFile.name}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "var(--text-main)" }}>
              {isDragActive ? "Drop your file here" : "Upload Medical Report"}
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Drag & drop your PDF or image here, or click to browse
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {["PDF", "PNG", "JPEG", "JPG"].map((ext) => (
                <span
                  key={ext}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default UploadBox;