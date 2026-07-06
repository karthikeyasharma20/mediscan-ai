function OCRResult({ text }) {
  if (!text) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>📄 Extracted Medical Report</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "15px",
        }}
      >
        {text}
      </pre>
    </div>
  );
}

export default OCRResult;