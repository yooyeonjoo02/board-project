import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePost, getPosts } from "../api/postApi";

const POST_TYPES = ["NOTICE", "PHOTO", "YOUTUBE", "GALLERY"];

export default function AdminPostManage() {
  const [selectedType, setSelectedType] = useState("NOTICE");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchPosts(type) {
    setLoading(true);
    setMessage("");

    try {
      const data = await getPosts(type);
      setPosts(data.items || []);
    } catch (error) {
      console.error(error);
      setMessage("게시글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts(selectedType);
  }, [selectedType]);

  async function handleDelete(id) {
    const ok = window.confirm("정말 이 게시글을 삭제할까요?");
    if (!ok) return;

    try {
      await deletePost(id);
      setMessage("게시글이 삭제되었습니다.");
      fetchPosts(selectedType);
    } catch (error) {
      console.error(error);
      setMessage("게시글 삭제에 실패했습니다.");
    }
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <h1>관리자 게시글 관리</h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {POST_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              style={{
                padding: "10px 14px",
                border: "1px solid #ccc",
                background: selectedType === type ? "#222" : "white",
                color: selectedType === type ? "white" : "#222",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {type}
            </button>
          ))}
        </div>

        <Link
          to="/admin/posts/create"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            background: "#222",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
          }}
        >
          새 글 작성
        </Link>
      </div>

      {message && (
        <p style={{ marginBottom: "16px", fontWeight: "bold" }}>{message}</p>
      )}

      {loading ? (
        <p>불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p>해당 타입의 게시글이 없습니다.</p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                  {post.type} | {post.createdAt}
                </div>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  {post.title}
                </div>
                {post.content && (
                  <div style={{ color: "#444" }}>
                    {String(post.content).slice(0, 80)}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Link
                  to={`/admin/posts/${post.id}/edit`}
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    background: "#222",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                  }}
                >
                  수정
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    background: "#c62828",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}