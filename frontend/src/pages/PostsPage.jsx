import { useEffect, useState } from "react";
import { fetchPosts } from "../api/client";

export default function PostsPage() {
  const [type, setType] = useState("PHOTO");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    fetchPosts(type, 1, 12)
      .then((data) => {
        if (!alive) return;
        setItems(data.items);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e.message);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [type]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Posts</h1>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        {["PHOTO", "NOTICE", "YOUTUBE"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: t === type ? "#222" : "white",
              color: t === type ? "white" : "#222",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <p>불러오는 중...</p>}
      {err && <p style={{ color: "crimson" }}>에러: {err}</p>}

      <ul style={{ paddingLeft: 16 }}>
        {items.map((p) => (
          <li key={p.id} style={{ marginBottom: 10 }}>
            <b>#{p.id}</b> [{p.type}] {p.title} <small>({p.createdAt})</small>
            <div style={{ color: "#555" }}>{p.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}