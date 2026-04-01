import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PhotoDetail.css";

const API_BASE = "https://board-project-fap6.onrender.com";

export default function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/api/posts/${postId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (cancelled) return;
        setPost(data);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "불러오기 실패");
        setPost(null);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    if (Number.isNaN(postId)) {
      setError("잘못된 id");
      setLoading(false);
      return;
    }

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  useEffect(() => {
    let cancelled = false;

    async function fetchListForNav() {
      try {
        const res = await fetch(`${API_BASE}/api/posts?type=PHOTO&page=1&size=200`);
        if (!res.ok) return;

        const data = await res.json();
        if (cancelled) return;
        setList(data.items ?? []);
      } catch {
        // 상세는 보이게 목록 nav 실패는 무시
      }
    }

    fetchListForNav();

    return () => {
      cancelled = true;
    };
  }, []);

  const { prevPost, nextPost } = useMemo(() => {
    const idx = list.findIndex((p) => Number(p.id) === postId);

    return {
      prevPost: idx > 0 ? list[idx - 1] : null,
      nextPost: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
    };
  }, [list, postId]);

  const imageUrls = useMemo(() => {
    if (!post) return [];
    if (Array.isArray(post.images)) return post.images;
    if (post.imageUrl) return [post.imageUrl];
    return [];
  }, [post]);

  function openLightbox(index) {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function showPrevImage() {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : imageUrls.length - 1
    );
  }

  function showNextImage() {
    setCurrentImageIndex((prev) =>
      prev < imageUrls.length - 1 ? prev + 1 : 0
    );
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(e) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrevImage();
      if (e.key === "ArrowRight") showNextImage();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, imageUrls.length]);

  if (loading) return <div className="photo-detail__status">불러오는 중...</div>;
  if (error) return <div className="photo-detail__status photo-detail__status--error">{error}</div>;
  if (!post) return <div className="photo-detail__status">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="photo-detail">
      <div className="photo-detail__topbar">
        <div className="photo-detail__nav-buttons">
          <button
            onClick={() => prevPost && navigate(`/activities/photos/${prevPost.id}`)}
            disabled={!prevPost}
            className="photo-detail__nav-button"
          >
            ← 이전글
          </button>

          <button
            onClick={() => nextPost && navigate(`/activities/photos/${nextPost.id}`)}
            disabled={!nextPost}
            className="photo-detail__nav-button"
          >
            다음글 →
          </button>
        </div>
      </div>

      <h1 className="photo-detail__title">{post.title}</h1>
      <div className="photo-detail__date">{post.createdAt}</div>

      {imageUrls.length > 0 && (
        <div className="photo-detail__image-grid">
          {imageUrls.map((imageUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => openLightbox(index)}
              className="photo-detail__image-button"
              aria-label={`이미지 ${index + 1} 확대보기`}
            >
              <img
                src={imageUrl}
                alt={`post-${index + 1}`}
                className="photo-detail__image"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <p className="photo-detail__content">{post.content}</p>

      {lightboxOpen && imageUrls.length > 0 && (
        <div className="photo-detail__lightbox" onClick={closeLightbox}>
          <div
            className="photo-detail__lightbox-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="photo-detail__lightbox-header">
              <div className="photo-detail__lightbox-count">
                {currentImageIndex + 1} / {imageUrls.length}
              </div>

              <div className="photo-detail__lightbox-actions">
                {imageUrls.length > 1 && (
                  <>
                    <button onClick={showPrevImage} className="photo-detail__lightbox-button">
                      ←
                    </button>
                    <button onClick={showNextImage} className="photo-detail__lightbox-button">
                      →
                    </button>
                  </>
                )}
                <button onClick={closeLightbox} className="photo-detail__lightbox-button">
                  ✕
                </button>
              </div>
            </div>

            <div className="photo-detail__lightbox-image-wrap">
              <img
                src={imageUrls[currentImageIndex]}
                alt={`lightbox-${currentImageIndex + 1}`}
                className="photo-detail__lightbox-image"
              />
            </div>

            <div className="photo-detail__lightbox-tip">
              팁: ESC 닫기 / ← → 키로 이미지 이동
            </div>
          </div>
        </div>
      )}
    </div>
  );
}