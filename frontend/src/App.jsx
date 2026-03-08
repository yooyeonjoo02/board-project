import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home";
import About from "./pages/About.jsx";
import PhotoBoard from "./pages/PhotoBoard.jsx";
import YoutubeBoard from "./pages/YoutubeBoard.jsx";
import NoticeBoard from "./pages/NoticeBoard.jsx";
import Gallery from "./pages/Gallery.jsx";

import PhotoDetail from "./pages/PhotoDetail.jsx";
import YoutubeDetail from "./pages/YoutubeDetail.jsx";
import GalleryDetail from "./pages/GalleryDetail.jsx";
import NoticeDetail from "./pages/NoticeDetail.jsx";

import AdminPostManage from "./pages/AdminPostManage.jsx";
import AdminPostCreate from "./pages/AdminPostCreate.jsx";
import AdminPostEdit from "./pages/AdminPostEdit.jsx";

function NotFound() {
  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: 16 }}>
      <h2>404</h2>
      <p>페이지를 찾을 수 없어요.</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Navbar />

      <main style={{ maxWidth: 1100, margin: "120px auto", padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/activities/photos" element={<PhotoBoard />} />
          <Route path="/activities/photos/:id" element={<PhotoDetail />} />

          <Route path="/activities/youtube" element={<YoutubeBoard />} />
          <Route path="/activities/youtube/:id" element={<YoutubeDetail />} />

          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />

          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />

          <Route path="/admin/posts" element={<AdminPostManage />} />   
          <Route path="/admin/posts/create" element={<AdminPostCreate />} />
          <Route path="/admin/posts/:id/edit" element={<AdminPostEdit />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}