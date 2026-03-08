// import { useEffect, useState } from "react";
// import PostCard from "../components/PostCard.jsx";
// import Pagination from "../components/Pagination.jsx";

// export default function PhotoBoard() {
//   const PER_PAGE = 12;
//   const [page, setPage] = useState(1);

//   const [items, setItems] = useState([]);
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

//   useEffect(() => {
//     let cancelled = false;

//     async function fetchPosts() {
//       setLoading(true);
//       setError("");

//       try {
//         const res = await fetch(
//           `http://localhost:4000/api/posts?type=PHOTO&page=${page}&size=${PER_PAGE}`
//         );

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(text || `HTTP ${res.status}`);
//         }

//         const data = await res.json();
//         if (cancelled) return;

//         setItems(data.items ?? []);
//         setTotal(data.total ?? 0);
//       } catch (e) {
//         if (cancelled) return;
//         setError(e.message || "불러오기 실패");
//       } finally {
//         if (cancelled) return;
//         setLoading(false);
//       }
//     }

//     fetchPosts();
//     return () => {
//       cancelled = true;
//     };
//   }, [page]);

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [totalPages, page]);

//   return (
//     <div>
//       <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>활동(사진)</h1>

//       {loading && <p>불러오는 중...</p>}
//       {error && <p style={{ color: "crimson" }}>{error}</p>}
//       {!loading && !error && items.length === 0 && <p>게시물이 없습니다.</p>}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//           gap: 16,
//         }}
//       >
//         {items.map((post) => {
//           const thumbnail =
//             Array.isArray(post.images) && post.images.length > 0
//               ? post.images[0]
//               : post.imageUrl ?? null;

//           return (
//             <PostCard
//               key={post.id}
//               to={`/activities/photos/${post.id}`}
//               thumbnail={thumbnail}
//               title={post.title}
//               createdAt={post.createdAt}
//             />
//           );
//         })}
//       </div>

//       <Pagination page={page} totalPages={totalPages} onChange={setPage} />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import Pagination from "../components/Pagination.jsx";
import "./PhotoBoard.css";

export default function PhotoBoard() {
  const PER_PAGE = 12;
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://localhost:4000/api/posts?type=PHOTO&page=${page}&size=${PER_PAGE}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (cancelled) return;

        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "불러오기 실패");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <div className="photo-board">
      <h1 className="photo-board__title">활동(사진)</h1>

      {loading && <p className="photo-board__status">불러오는 중...</p>}
      {error && <p className="photo-board__status photo-board__status--error">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="photo-board__status">게시물이 없습니다.</p>
      )}

      <div className="photo-board__grid">
        {items.map((post) => {
          const thumbnail =
            Array.isArray(post.images) && post.images.length > 0
              ? post.images[0]
              : post.imageUrl ?? null;

          return (
            <PostCard
              key={post.id}
              to={`/activities/photos/${post.id}`}
              thumbnail={thumbnail}
              title={post.title}
              createdAt={post.createdAt}
            />
          );
        })}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}