import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = "https://board-project-fap6.onrender.com";

export default function YoutubeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1) 상세 불러오기
  useEffect(() => {
    let ignore = false;

    async function fetchDetail() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BASE_URL}/api/posts/${postId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "게시글 조회 실패");

        if (ignore) return;
        setPost(data);
      } catch (e) {
        if (ignore) return;
        setPost(null);
        setError(e.message || "에러가 발생했습니다.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (Number.isNaN(postId)) {
      setError("잘못된 게시글 id 입니다.");
      setLoading(false);
      return;
    }

    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [postId]);

  // 2) 이전글/다음글 찾기 (같은 타입(YOUTUBE) 기준으로 id 기준 탐색)
  useEffect(() => {
    let ignore = false;

    async function fetchPrevNext() {
      if (!post) return;

      // 유튜브 게시글이 아니면 prev/next는 비워도 됨 (안전)
      if (post.type !== "YOUTUBE") {
        setPrevPost(null);
        setNextPost(null);
        return;
      }

      try {
        // prev: 현재 id보다 작은 것 중 가장 큰 id 1개
        // next: 현재 id보다 큰 것 중 가장 작은 id 1개
        // ✅ 지금 백엔드가 "id 범위 검색" API는 없으니,
        //    간단히 page/size로 가져와서 1개만 만드는 방식으로 우회.
        //    (실무라면 /api/posts/prev-next 같은 API를 백엔드에 추가하는 게 더 깔끔함)

        // Prev 찾기: page/size가 아니라 "전체"를 가져올 수 없으니,
        // 현실적인 방식: YOUTUBE 전체를 가져오는 endpoint를 추가하거나,
        // 지금은 "가장 간단한" 방법으로 id-1부터 내려가며 존재하는지 확인.
        // (데이터 적을 때 OK. 나중엔 백엔드 개선 권장)

        const foundPrev = await findNearestExisting(postId, -1);
        const foundNext = await findNearestExisting(postId, +1);

        if (ignore) return;
        setPrevPost(foundPrev);
        setNextPost(foundNext);
      } catch {
        if (ignore) return;
        setPrevPost(null);
        setNextPost(null);
      }
    }

    fetchPrevNext();
    return () => {
      ignore = true;
    };
  }, [post, postId]);

  const youtubeId = useMemo(() => extractYoutubeId(post?.youtubeUrl), [post]);
  const thumb = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

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
        <button onClick={() => navigate(-1)} style={btnStyle()}>
          ← 뒤로가기
        </button>
      </div>
    );
  }

  if (!post) return <div style={{ padding: 16 }}>게시글을 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* 상단 네비 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => navigate(-1)} style={btnStyle()}>
          ← 목록으로
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button
            onClick={() => prevPost && navigate(`/activities/youtube/${prevPost.id}`)}
            disabled={!prevPost}
            style={btnStyle(!prevPost)}
          >
            ← 이전글
          </button>

          <button
            onClick={() => nextPost && navigate(`/activities/youtube/${nextPost.id}`)}
            disabled={!nextPost}
            style={btnStyle(!nextPost)}
          >
            다음글 →
          </button>
        </div>
      </div>

      <h1 style={{ margin: "0 0 8px" }}>{post.title}</h1>
      <div style={{ color: "#666", marginBottom: 16 }}>{post.createdAt}</div>

      {/* 썸네일(클릭하면 유튜브 이동) */}
      {post.youtubeUrl ? (
        <>
          <a href={post.youtubeUrl} target="_blank" rel="noreferrer">
            <img
              src={thumb ?? undefined}
              alt="유튜브 썸네일"
              style={{
                width: "100%",
                borderRadius: 12,
                display: "block",
                cursor: "pointer",
                marginBottom: 16,
                background: "#f3f3f3",
              }}
            />
          </a>

          <div style={{ marginBottom: 12, color: "#333" }}>
            썸네일을 클릭하면 유튜브로 이동합니다.
          </div>

          <div style={{ marginTop: 18 }}>
            <a href={post.youtubeUrl} target="_blank" rel="noreferrer">
              유튜브로 이동 →
            </a>
          </div>
        </>
      ) : (
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
          youtubeUrl이 없습니다. (Postman에서 youtubeUrl 포함해서 생성했는지 확인!)
        </div>
      )}

      <p style={{ lineHeight: 1.7, marginTop: 16 }}>{post.content}</p>
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

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.split("/")[1] || null;
    }

    const v = u.searchParams.get("v");
    if (v) return v;

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

/**
 * ✅ "가까운 이전/다음글"을 찾는 임시 방식 (데이터 적을 때 OK)
 * direction = -1 (prev), +1 (next)
 *
 * - id를 하나씩 이동하면서 /api/posts/:id를 조회
 * - 같은 타입(YOUTUBE)일 때만 반환
 * - 너무 멀리 가면(최대 200번) 포기
 *
 * 나중에 백엔드에 prev/next API를 추가하면 이 함수 삭제 가능
 */
async function findNearestExisting(startId, direction) {
  const MAX_TRY = 200;

  for (let i = 1; i <= MAX_TRY; i++) {
    const targetId = startId + direction * i;
    if (targetId <= 0) return null;

    const res = await fetch(`${BASE_URL}/api/posts/${targetId}`);
    if (!res.ok) continue;

    const data = await res.json();
    if (data?.type === "YOUTUBE") return data;
  }

  return null;
}