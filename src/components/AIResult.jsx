function AIResult({ analysis }) {
  if (!analysis) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "25px",
        background: "#e8fff0",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>🤖 AI Health Analysis</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "15px",
          lineHeight: "28px",
        }}
      >
        {analysis}
      </pre>
    </div>
  );
}

export default AIResult;