export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      style={{
        marginTop: 18,
        display: "flex",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={btnStyle(page === 1)}
      >
        이전
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={pageBtnStyle(page === p)}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={btnStyle(page === totalPages)}
      >
        다음
      </button>
    </div>
  );
}

function btnStyle(disabled) {
  return {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: disabled ? "#f5f5f5" : "white",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function pageBtnStyle(active) {
  return {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: active ? "#222" : "white",
    color: active ? "white" : "#222",
    cursor: "pointer",
    fontWeight: 700,
  };
}