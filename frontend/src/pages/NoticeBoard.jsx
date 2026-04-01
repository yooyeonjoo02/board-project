import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination.jsx";

export default function NoticeBoard() {
  const PER_PAGE = 15;

  const [page, setPage] = useState(1);

  // ✅ API에서 가져온 데이터 상태
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 필요하면 .env로 빼도 됨
  const BASE_URL = "https://board-project-fap6.onrender.com";

  // ✅ 전체 페이지 수
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // ✅ page가 totalPages보다 커지는 경우 방어
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // ✅ 서버에서 공지사항 목록 가져오기
  useEffect(() => {
    let ignore = false;

    async function fetchNotices() {
      try {
        setLoading(true);
        setError("");

        const url = new URL(`${BASE_URL}/api/posts`);
        url.searchParams.set("type", "NOTICE");
        url.searchParams.set("page", String(page));
        url.searchParams.set("size", String(PER_PAGE));

        const res = await fetch(url.toString());
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "공지사항 조회 실패");
        }

        if (ignore) return;

        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      } catch (e) {
        if (ignore) return;
        setError(e.message || "에러가 발생했습니다.");
        setItems([]);
        setTotal(0);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchNotices();
    return () => {
      ignore = true;
    };
  }, [page]);

  const pageItems = useMemo(() => items, [items]);

  return (
    <div>
      <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>공지사항</h1>

      {loading && (
        <div style={{ padding: "12px 0", color: "#666" }}>불러오는 중…</div>
      )}

      {error && (
        <div
          style={{
            padding: "12px 14px",
            border: "1px solid #ffd5d5",
            background: "#fff5f5",
            color: "#c00",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 14,
          overflow: "hidden",
          background: "white",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={thStyle({ width: 90 })}>번호</th>
              <th style={thStyle({ textAlign: "left" })}>제목</th>
              <th style={thStyle({ width: 140 })}>작성일</th>
            </tr>
          </thead>

          <tbody>
            {!loading && pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    padding: 18,
                    textAlign: "center",
                    color: "#777",
                  }}
                >
                  공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              pageItems.map((post) => (
                <tr key={post.id} style={rowStyle}>
                  <td style={tdStyle({ textAlign: "center", color: "#666" })}>
                    {post.id}
                  </td>

                  <td style={tdStyle({ textAlign: "left" })}>
                    <Link
                      to={`/notices/${post.id}`}
                      style={{
                        color: "#111",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      {post.title}
                    </Link>
                  </td>

                  <td style={tdStyle({ textAlign: "center", color: "#666" })}>
                    {post.createdAt}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

const thStyle = (extra = {}) => ({
  padding: "14px 12px",
  fontSize: 14,
  fontWeight: 700,
  borderBottom: "1px solid #eee",
  ...extra,
});

const tdStyle = (extra = {}) => ({
  padding: "14px 12px",
  fontSize: 14,
  borderBottom: "1px solid #f0f0f0",
  ...extra,
});

const rowStyle = {
  cursor: "pointer",
};