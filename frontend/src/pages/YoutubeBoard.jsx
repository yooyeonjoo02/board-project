// import { useMemo, useState } from "react";
// import PostCard from "../components/PostCard.jsx";
// import Pagination from "../components/Pagination.jsx";
// import youtubePosts from "../data/youtubePosts.js";

// export default function YoutubeBoard() {
//   const PER_PAGE = 12; // 3x4
//   const [page, setPage] = useState(1);

//   const totalPages = Math.ceil(youtubePosts.length / PER_PAGE);

//   const pageItems = useMemo(() => {
//     const start = (page - 1) * PER_PAGE;
//     return youtubePosts.slice(start, start + PER_PAGE);
//   }, [page]);

//   return (
//     <div>
//       <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>활동(유튜브)</h1>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//           gap: 16,
//         }}
//       >
//         {pageItems.map((post) => (
//           <PostCard
//             key={post.id}
//             to={`/activities/youtube/${post.id}`}
//             thumbnail={`https://img.youtube.com/vi/${post.youtubeId}/hqdefault.jpg`}
//             title={post.title}
//             createdAt={post.createdAt}
//           />
//         ))}
//       </div>

//       <Pagination page={page} totalPages={totalPages} onChange={setPage} />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import Pagination from "../components/Pagination.jsx";

const BASE_URL = "http://localhost:4000";
const PER_PAGE = 12; // 3x4

export default function YoutubeBoard() {
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ page 바뀔 때마다 서버에서 해당 페이지 데이터 가져오기
  useEffect(() => {
    let ignore = false;

    async function fetchList() {
      try {
        setLoading(true);
        setError("");

        const url = new URL(`${BASE_URL}/api/posts`);
        url.searchParams.set("type", "YOUTUBE");
        url.searchParams.set("page", String(page));
        url.searchParams.set("size", String(PER_PAGE));

        const res = await fetch(url.toString());
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "목록 조회 실패");

        if (ignore) return;
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      } catch (e) {
        if (ignore) return;
        setItems([]);
        setTotal(0);
        setError(e.message || "에러가 발생했습니다.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchList();
    return () => {
      ignore = true;
    };
  }, [page]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / PER_PAGE));
  }, [total]);

  // ✅ 서버 total이 줄어 page가 범위를 벗어나면 보정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (loading) return <div style={{ padding: 16 }}>불러오는 중…</div>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
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
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>활동(유튜브)</h1>

      {items.length === 0 ? (
        <div style={{ padding: 16, color: "#666" }}>게시글이 없습니다.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {items.map((post) => {
            const youtubeId = extractYoutubeId(post.youtubeUrl);
            const thumbnail = youtubeId
              ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
              : null;

            return (
              <PostCard
                key={post.id}
                to={`/activities/youtube/${post.id}`}
                thumbnail={thumbnail ?? undefined} // 없으면 PostCard에서 기본 이미지 처리하면 좋음
                title={post.title}
                createdAt={post.createdAt}
              />
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

/**
 * 다양한 유튜브 URL에서 videoId 뽑기:
 * - https://www.youtube.com/watch?v=VIDEOID
 * - https://youtu.be/VIDEOID
 * - https://www.youtube.com/shorts/VIDEOID
 * - https://www.youtube.com/embed/VIDEOID
 */
function extractYoutubeId(url) {
  if (!url) return null;

  try {
    const u = new URL(url);

    // youtu.be/VIDEOID
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.split("/")[1] || null;
    }

    // youtube.com/watch?v=VIDEOID
    const v = u.searchParams.get("v");
    if (v) return v;

    // youtube.com/shorts/VIDEOID or /embed/VIDEOID
    const parts = u.pathname.split("/").filter(Boolean);
    const idxShorts = parts.indexOf("shorts");
    if (idxShorts >= 0 && parts[idxShorts + 1]) return parts[idxShorts + 1];

    const idxEmbed = parts.indexOf("embed");
    if (idxEmbed >= 0 && parts[idxEmbed + 1]) return parts[idxEmbed + 1];

    return null;
  } catch {
    return null;
  }
}