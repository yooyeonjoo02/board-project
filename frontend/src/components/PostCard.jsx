import { Link } from "react-router-dom";

export default function PostCard({ to, thumbnail, title, createdAt }) {
  return (
    <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        style={{
          border: "1px solid #eee",
          borderRadius: 14,
          overflow: "hidden",
          background: "white",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          transition: "transform 0.08s ease",
        }}
      >
        {/* <div style={{ aspectRatio: "4 / 3", background: "#f3f3f3" }}>
          <img
            src={thumbnail}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />
        </div> */}
        <div style={{ aspectRatio: "4 / 3", background: "#f3f3f3" }}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontSize: 14,
              }}
            >
              이미지 없음
            </div>
          )}
        </div>

        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
            {createdAt}
          </div>
        </div>
      </article>
    </Link>
  );
}