// import { useMemo, useState } from "react";
// import Pagination from "../components/Pagination.jsx";
// import galleryPosts from "../data/galleryPosts.js";
// import { Link } from "react-router-dom";

// export default function Gallery() {
//   const PER_PAGE = 30; // 6x5
//   const [page, setPage] = useState(1);

//   const totalPages = Math.ceil(galleryPosts.length / PER_PAGE);

//   const pageItems = useMemo(() => {
//     const start = (page - 1) * PER_PAGE;
//     return galleryPosts.slice(start, start + PER_PAGE);
//   }, [page]);

//   return (
//     <div>
//       <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>갤러리</h1>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
//           gap: 10,
//         }}
//       >
//         {pageItems.map((post) => (
//           <Link
//             key={post.id}
//             to={`/gallery/${post.id}`}
//             style={{ textDecoration: "none" }}
//             aria-label={`${post.title} 보기`}
//           >
//             <div
//               style={{
//                 borderRadius: 12,
//                 overflow: "hidden",
//                 border: "1px solid #eee",
//                 background: "#f3f3f3",
//                 boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
//               }}
//             >
//               <div style={{ aspectRatio: "1 / 1" }}>
//                 <img
//                   src={post.thumbnail}
//                   alt={post.title}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     display: "block",
//                   }}
//                   loading="lazy"
//                 />
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       <Pagination page={page} totalPages={totalPages} onChange={setPage} />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination.jsx";

const API_BASE = "http://localhost:4000";

export default function Gallery() {
  const PER_PAGE = 30; // 6x5
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `${API_BASE}/api/posts?type=GALLERY&page=${page}&size=${PER_PAGE}`
      );
      if (!res.ok) throw new Error("Failed to load gallery");
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    }

    load().catch((e) => {
      console.error(e);
      setItems([]);
      setTotal(0);
    });
  }, [page]);

  const pageItems = useMemo(() => items, [items]);

  return (
    <div>
      <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>갤러리</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {pageItems.map((post) => (
          <Link
            key={post.id}
            to={`/gallery/${post.id}`}
            style={{ textDecoration: "none" }}
            aria-label={`${post.title} 보기`}
          >
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #eee",
                background: "#f3f3f3",
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ aspectRatio: "1 / 1" }}>
                <img
                  src={post.imageUrl || "https://via.placeholder.com/400?text=NO+IMAGE"}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}