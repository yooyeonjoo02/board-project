import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const postId = Number(id);

  const BASE_URL = "https://board-project-fap6.onrender.com";

  const [post, setPost] = useState(null);
  const [list, setList] = useState([]); // prev/next 계산용
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ 상세 + 리스트(공지) 같이 로드
  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        // 1) 상세
        const detailRes = await fetch(`${BASE_URL}/api/posts/${postId}`);
        const detailData = await detailRes.json();
        if (!detailRes.ok) throw new Error(detailData?.error || "상세 조회 실패");

        // 2) 공지 목록( prev/next 계산 )
        //    size는 넉넉히. (공지글이 많아지면 백엔드에서 prev/next API 만드는 게 더 좋음)
        const listUrl = new URL(`${BASE_URL}/api/posts`);
        listUrl.searchParams.set("type", "NOTICE");
        listUrl.searchParams.set("page", "1");
        listUrl.searchParams.set("size", "200");

        const listRes = await fetch(listUrl.toString());
        const listData = await listRes.json();
        if (!listRes.ok) throw new Error(listData?.error || "목록 조회 실패");

        if (ignore) return;

        setPost(detailData);
        setList(listData.items ?? []);
      } catch (e) {
        if (ignore) return;
        setError(e.message || "에러가 발생했습니다.");
        setPost(null);
        setList([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (!Number.isFinite(postId)) {
      setError("잘못된 게시글 id 입니다.");
      setLoading(false);
      return;
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [postId]);

  // ✅ prev/next 계산 (createdAt DESC 기준)
  const { prevPost, nextPost } = useMemo(() => {
    if (!list.length) return { prevPost: null, nextPost: null };

    const sorted = [...list].sort((a, b) => Number(b.id) - Number(a.id));
    const idx = sorted.findIndex((p) => Number(p.id) === postId);

    return {
      // 목록이 최신순일 때:
      // idx-1 = 더 최신(위에 있는 글), idx+1 = 더 이전(아래 있는 글)
      prevPost: idx > 0 ? sorted[idx - 1] : null,
      nextPost: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
    };
  }, [list, postId]);

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

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          ← 목록으로
        </button>
      </div>
    );
  }

  if (!post) return <div style={{ padding: 16 }}>게시글을 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* 목록 버튼 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          background: "white",
          cursor: "pointer",
        }}
      >
        ← 목록으로
      </button>

      <h1 style={{ margin: "0 0 8px" }}>{post.title}</h1>

      <div style={{ color: "#666", marginBottom: 20 }}>{post.createdAt}</div>

      {/* 공지사항은 보통 이미지 없음 (DB도 imageUrl 1개 구조) */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt=""
          style={{
            width: "100%",
            marginBottom: 20,
            borderRadius: 10,
          }}
        />
      )}

      <p style={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{post.content}</p>

      {/* 이전글 / 다음글 */}
      <div
        style={{
          marginTop: 40,
          borderTop: "1px solid #eee",
          paddingTop: 20,
        }}
      >
        {prevPost && (
          <div style={{ marginBottom: 8 }}>
            이전글 :
            <Link to={`/notices/${prevPost.id}`} style={{ marginLeft: 8 }}>
              {prevPost.title}
            </Link>
          </div>
        )}

        {nextPost && (
          <div>
            다음글 :
            <Link to={`/notices/${nextPost.id}`} style={{ marginLeft: 8 }}>
              {nextPost.title}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}