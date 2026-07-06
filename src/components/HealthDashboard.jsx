function HealthDashboard({ analysis }) {
  if (!analysis) return null;

  return (
    <div
      style={{
        marginTop: "40px",
      }}
    >
      <h1>🏥 Health Dashboard</h1>

      {/* Health Score & Risk Level */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "#DBEAFE",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>❤️ Health Score</h3>

          <h1>{analysis.healthScore}/100</h1>
        </div>

        <div
          style={{
            background: "#DCFCE7",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>⚠ Risk Level</h3>

          <h1>{analysis.riskLevel}</h1>
        </div>
      </div>

      <br />

      {/* Summary */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>📄 Summary</h2>

        <p>{analysis.summary}</p>
      </div>

      <br />

      {/* Abnormal Values */}
      <div
        style={{
          background: "#FFF1F2",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>🩸 Abnormal Values</h2>

        {analysis.abnormalValues &&
          analysis.abnormalValues.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#FEE2E2",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>{item.test}</strong>

              <span> — {item.status}</span>
            </div>
          ))}
      </div>

      <br />

      {/* AI Suggestions */}
      <div
        style={{
          background: "#ECFDF5",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>💡 AI Suggestions</h2>

        <ul>
          {analysis.suggestions &&
            analysis.suggestions.map((item, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "10px",
                }}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default HealthDashboard;