import { NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import galleryPosts from "../data/galleryPosts";
import "./Home.css";

const PAGE_SIZE = 4;
const VISIBLE_PAGES = 4; // ✅ 페이지 번호는 4개만 보이게

export default function Home() {
  const [page, setPage] = useState(1);

  // ✅ 최신순 정렬 (createdAt 기준)
  const sortedGallery = useMemo(() => {
    return [...galleryPosts].sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    );
  }, []);

  const totalPages = Math.max(1, Math.ceil(sortedGallery.length / PAGE_SIZE));

  // ✅ 혹시 page가 범위를 벗어나면 자동 보정
  const safePage = Math.min(Math.max(page, 1), totalPages);

  // ✅ 현재 페이지에 보여줄 4개
  const latestGallery = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedGallery.slice(start, start + PAGE_SIZE);
  }, [sortedGallery, safePage]);

  // ✅ 페이지 번호 4개만 보이게 계산
  const startPage =
    Math.floor((safePage - 1) / VISIBLE_PAGES) * VISIBLE_PAGES + 1;
  const endPage = Math.min(startPage + VISIBLE_PAGES - 1, totalPages);

  const visiblePageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setPage(totalPages);

  return (
    <div className="home">
      {/* ✅ 풀폭 배너 */}
      <section className="hero">
        <img
          className="heroImg"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
          alt="메인 배너"
        />

        <div className="heroOverlay">
          <h1 className="heroTitle">사단법인 북한인권</h1>
          <p className="heroDesc">
            북한 주민의 인권 보호와 증진을 위해 함께합니다.
          </p>

          <div className="heroBtns">
            <NavLink to="/about" className="heroBtn">
              단체 소개
            </NavLink>
            <NavLink to="/gallery" className="heroBtn ghost">
              갤러리 보기
            </NavLink>
          </div>
        </div>
      </section>

      {/* ✅ 최근 갤러리 (Home에서 4개씩 페이지네이션) */}
      <section className="homeSection pageContainer">
        <div className="sectionHeader">
          <h2 className="sectionTitle">최근 갤러리</h2>
          <NavLink to="/gallery" className="sectionMore">
            더보기 →
          </NavLink>
        </div>

        <div className="grid4">
          {latestGallery.map((post) => (
            <NavLink key={post.id} to={`/gallery/${post.id}`} className="card">
              <div className="thumbWrap">
                <img
                  className="thumb"
                  src={post.thumbnail}
                  alt={post.title}
                  loading="lazy"
                />
              </div>

              <div className="cardBody">
                <div className="cardTitle">{post.title}</div>
                <div className="cardMeta">{post.createdAt}</div>
              </div>
            </NavLink>
          ))}
        </div>

        {/* ✅ Home용 Pagination */}
        <div className="homePager">
          <button
            className="pagerBtn"
            onClick={goFirst}
            disabled={safePage === 1}
            aria-label="첫 페이지"
          >
            «
          </button>
          <button
            className="pagerBtn"
            onClick={goPrev}
            disabled={safePage === 1}
            aria-label="이전 페이지"
          >
            ‹
          </button>

          {visiblePageNumbers.map((p) => (
            <button
              key={p}
              className={`pagerNum ${p === safePage ? "active" : ""}`}
              onClick={() => setPage(p)}
              aria-current={p === safePage ? "page" : undefined}
            >
              {p}
            </button>
          ))}

          <button
            className="pagerBtn"
            onClick={goNext}
            disabled={safePage === totalPages}
            aria-label="다음 페이지"
          >
            ›
          </button>
          <button
            className="pagerBtn"
            onClick={goLast}
            disabled={safePage === totalPages}
            aria-label="마지막 페이지"
          >
            »
          </button>
        </div>
      </section>
    </div>
  );
}