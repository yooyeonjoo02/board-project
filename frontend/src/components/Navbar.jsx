import { NavLink } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../assets/돈.jpg";

export default function Navbar() {
  const headerRef = useRef(null);
  const [isShrink, setIsShrink] = useState(false);

  // ✅ 헤더 높이를 CSS 변수로 반영하는 함수
  const syncHeaderHeight = () => {
    if (!headerRef.current) return;
    const h = headerRef.current.offsetHeight;
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  };

  useEffect(() => {
    const onScroll = () => setIsShrink(window.scrollY > 40);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ shrink 변경 / 첫 렌더 / 리사이즈 때마다 헤더 높이 다시 계산
  useLayoutEffect(() => {
    syncHeaderHeight();
  }, [isShrink]);

  useEffect(() => {
    const onResize = () => syncHeaderHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header ref={headerRef} className={`siteHeader ${isShrink ? "shrink" : ""}`}>
      <div className="headerInner">
        <NavLink to="/" className="logoLink" aria-label="홈으로 이동">
          <img className="logoImg" src={logo} alt="단체 로고" />
        </NavLink>

        <nav className="mainNav">
          <div className="dropdown">
            <NavLink to="/about" className="navItem">
              단체 소개
            </NavLink>
            <div className="dropdownMenu">
              <NavLink to="/about/greeting" className="dropdownItem">
                인사말
              </NavLink>
              <NavLink to="/about/rules" className="dropdownItem">
                정관
              </NavLink>
              <NavLink to="/about/founding" className="dropdownItem">
                창립선언문
              </NavLink>
            </div>
          </div>

          <NavLink to="/activities/photos" className="navItem">
            활동(사진)
          </NavLink>
          <NavLink to="/activities/youtube" className="navItem">
            활동(유튜브)
          </NavLink>
          <NavLink to="/notices" className="navItem">
            공지사항
          </NavLink>
          <NavLink to="/gallery" className="navItem">
            갤러리
          </NavLink>
        </nav>

        <div className="utilNav">
          <NavLink to="/login" className="utilItem">
            LOGIN
          </NavLink>
          <NavLink to="/join" className="utilItem">
            JOIN
          </NavLink>
        </div>
      </div>
    </header>
  );
}