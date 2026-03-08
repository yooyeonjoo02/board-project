// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import galleryPosts from "../data/galleryPosts.js";

// export default function GalleryDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const postId = Number(id);
//   const post = galleryPosts.find((p) => p.id === postId);

//   const { prevPost, nextPost } = useMemo(() => {
//     const sorted = [...galleryPosts].sort((a, b) => a.id - b.id);
//     const idx = sorted.findIndex((p) => p.id === postId);

//     return {
//       prevPost: idx > 0 ? sorted[idx - 1] : null,
//       nextPost: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
//     };
//   }, [postId]);

//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     setIndex(0); // 다른 게시글로 이동하면 첫 장부터
//   }, [postId]);

//   const goPrev = () => {
//     if (!post) return;
//     setIndex((cur) => (cur - 1 + post.images.length) % post.images.length);
//   };

//   const goNext = () => {
//     if (!post) return;
//     setIndex((cur) => (cur + 1) % post.images.length);
//   };

//   useEffect(() => {
//     const onKeyDown = (e) => {
//       if (e.key === "ArrowLeft") goPrev();
//       if (e.key === "ArrowRight") goNext();
//       if (e.key === "Escape") navigate(-1);
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [post, navigate]);

//   if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

//   return (
//     <div style={{ maxWidth: 900 }}>
//       {/* 상단 네비 */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
//         <button onClick={() => navigate(-1)} style={btnStyle()}>
//           ← 목록으로
//         </button>

//         <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
//           <button
//             onClick={() => prevPost && navigate(`/gallery/${prevPost.id}`)}
//             disabled={!prevPost}
//             style={btnStyle(!prevPost)}
//           >
//             ← 이전글
//           </button>

//           <button
//             onClick={() => nextPost && navigate(`/gallery/${nextPost.id}`)}
//             disabled={!nextPost}
//             style={btnStyle(!nextPost)}
//           >
//             다음글 →
//           </button>
//         </div>
//       </div>

//       <h1 style={{ margin: "0 0 8px" }}>{post.title}</h1>
//       <div style={{ color: "#666", marginBottom: 16 }}>{post.createdAt}</div>

//       {/* 인스타 스타일 캐러셀 */}
//       <div
//         style={{
//           position: "relative",
//           borderRadius: 16,
//           overflow: "hidden",
//           background: "#111",
//           boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
//         }}
//       >
//         <div style={{ aspectRatio: "4 / 3" }}>
//           <img
//             src={post.images[index]}
//             alt=""
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "contain",
//               display: "block",
//               background: "#111",
//             }}
//           />
//         </div>

//         {/* 좌우 버튼 */}
//         <button onClick={goPrev} style={navBtnStyle("left")} aria-label="이전 이미지">
//           ‹
//         </button>
//         <button onClick={goNext} style={navBtnStyle("right")} aria-label="다음 이미지">
//           ›
//         </button>

//         {/* 하단 인디케이터 */}
//         <div
//           style={{
//             position: "absolute",
//             left: 0,
//             right: 0,
//             bottom: 10,
//             display: "flex",
//             justifyContent: "center",
//             gap: 6,
//           }}
//         >
//           {post.images.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setIndex(i)}
//               aria-label={`이미지 ${i + 1}로 이동`}
//               style={{
//                 width: 8,
//                 height: 8,
//                 borderRadius: 999,
//                 border: "none",
//                 background: i === index ? "white" : "rgba(255,255,255,0.4)",
//                 cursor: "pointer",
//                 padding: 0,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       <p style={{ marginTop: 16, lineHeight: 1.7 }}>{post.content}</p>

//       <div style={{ marginTop: 10, color: "#666", fontSize: 12 }}>
//         팁: 키보드 ← → 로 넘기기 / ESC로 뒤로가기
//       </div>
//     </div>
//   );
// }

// function btnStyle(disabled = false) {
//   return {
//     padding: "8px 12px",
//     borderRadius: 10,
//     border: "1px solid #ddd",
//     background: disabled ? "#f5f5f5" : "white",
//     cursor: disabled ? "not-allowed" : "pointer",
//   };
// }

// function navBtnStyle(side) {
//   const common = {
//     position: "absolute",
//     top: "50%",
//     transform: "translateY(-50%)",
//     width: 44,
//     height: 44,
//     borderRadius: 999,
//     border: "1px solid rgba(255,255,255,0.25)",
//     background: "rgba(0,0,0,0.35)",
//     color: "white",
//     cursor: "pointer",
//     fontSize: 28,
//     lineHeight: "42px",
//     textAlign: "center",
//   };

//   if (side === "left") return { ...common, left: 10 };
//   return { ...common, right: 10 };
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:4000";

export default function GalleryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [allIds, setAllIds] = useState([]);

  // 캐러셀 index
  const [index, setIndex] = useState(0);

  // ✅ 상세 가져오기
  useEffect(() => {
    async function loadDetail() {
      const res = await fetch(`${API_BASE}/api/posts/${postId}`);
      if (!res.ok) {
        setPost(null);
        return;
      }
      const data = await res.json();
      setPost(data);
    }
    loadDetail().catch(console.error);
  }, [postId]);

  // ✅ prev/next 계산용: 갤러리 전체 id 목록 가져오기(간단버전)
  useEffect(() => {
    async function loadIds() {
      const res = await fetch(`${API_BASE}/api/posts?type=GALLERY&page=1&size=1000`);
      if (!res.ok) return;
      const data = await res.json();
      const ids = (data.items || [])
        .map((p) => Number(p.id))
        .filter((n) => Number.isFinite(n))
        .sort((a, b) => a - b);
      setAllIds(ids);
    }
    loadIds().catch(console.error);
  }, []);

  // 다른 게시글로 이동하면 첫 장부터
  useEffect(() => {
    setIndex(0);
  }, [postId]);

  const { prevId, nextId } = useMemo(() => {
    const idx = allIds.findIndex((x) => x === postId);
    return {
      prevId: idx > 0 ? allIds[idx - 1] : null,
      nextId: idx >= 0 && idx < allIds.length - 1 ? allIds[idx + 1] : null,
    };
  }, [allIds, postId]);

  const images = post?.images || [];

  const goPrev = () => {
    if (!images.length) return;
    setIndex((cur) => (cur - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (!images.length) return;
    setIndex((cur) => (cur + 1) % images.length);
  };

  // 키보드 조작
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") navigate(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, navigate]);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* 상단 네비 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => navigate(-1)} style={btnStyle()}>
          ← 목록으로
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button
            onClick={() => prevId && navigate(`/gallery/${prevId}`)}
            disabled={!prevId}
            style={btnStyle(!prevId)}
          >
            ← 이전글
          </button>

          <button
            onClick={() => nextId && navigate(`/gallery/${nextId}`)}
            disabled={!nextId}
            style={btnStyle(!nextId)}
          >
            다음글 →
          </button>
        </div>
      </div>

      <h1 style={{ margin: "0 0 8px" }}>{post.title}</h1>
      <div style={{ color: "#666", marginBottom: 16 }}>{post.createdAt}</div>

      {/* 인스타 스타일 캐러셀 */}
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          background: "#111",
          boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ aspectRatio: "4 / 3" }}>
          <img
            src={images[index] || "https://via.placeholder.com/900?text=NO+IMAGE"}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              background: "#111",
            }}
          />
        </div>

        {/* 좌우 버튼 */}
        <button onClick={goPrev} style={navBtnStyle("left")} aria-label="이전 이미지">
          ‹
        </button>
        <button onClick={goNext} style={navBtnStyle("right")} aria-label="다음 이미지">
          ›
        </button>

        {/* 하단 인디케이터 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 10,
            display: "flex",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`이미지 ${i + 1}로 이동`}
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                border: "none",
                background: i === index ? "white" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <p style={{ marginTop: 16, lineHeight: 1.7 }}>{post.content}</p>

      <div style={{ marginTop: 10, color: "#666", fontSize: 12 }}>
        팁: 키보드 ← → 로 넘기기 / ESC로 뒤로가기
      </div>
    </div>
  );
}

function btnStyle(disabled = false) {
  return {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: disabled ? "#f5f5f5" : "white",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function navBtnStyle(side) {
  const common = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(0,0,0,0.35)",
    color: "white",
    cursor: "pointer",
    fontSize: 28,
    lineHeight: "42px",
    textAlign: "center",
  };

  if (side === "left") return { ...common, left: 10 };
  return { ...common, right: 10 };
}