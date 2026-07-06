function Loader({ loading }) {
  if (!loading) return null;

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "30px",
      }}
    >
      <h2>⏳ AI is analyzing your report...</h2>
    </div>
  );
}

export default Loader;