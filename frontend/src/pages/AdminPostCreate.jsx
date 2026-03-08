import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, uploadImages } from "../api/postApi";

export default function AdminPostCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "NOTICE",
    youtubeUrl: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let uploadedImageUrls = [];

      if (
        (form.type === "PHOTO" || form.type === "GALLERY") &&
        selectedFiles.length > 0
      ) {
        const uploadResult = await uploadImages(selectedFiles);
        uploadedImageUrls = uploadResult.imageUrls || [];
      }

      const payload = {
        title: form.title,
        content: form.content,
        type: form.type,
        youtubeUrl: form.youtubeUrl.trim() === "" ? null : form.youtubeUrl.trim(),
        images: uploadedImageUrls,
      };

      await createPost(payload);

      setMessage("게시글이 등록되었습니다.");

      setForm({
        title: "",
        content: "",
        type: "NOTICE",
        youtubeUrl: "",
      });
      setSelectedFiles([]);

      navigate("/admin/posts");
    } catch (error) {
      console.error(error);
      setMessage("게시글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>관리자 글 작성</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <div>
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            style={{ width: "100%", padding: "10px", marginTop: "8px" }}
            required
          />
        </div>

        <div>
          <label>내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
            rows="8"
            style={{ width: "100%", padding: "10px", marginTop: "8px" }}
            required
          />
        </div>

        <div>
          <label>게시판 타입</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginTop: "8px" }}
          >
            <option value="NOTICE">NOTICE</option>
            <option value="PHOTO">PHOTO</option>
            <option value="YOUTUBE">YOUTUBE</option>
            <option value="GALLERY">GALLERY</option>
          </select>
        </div>

        {form.type === "YOUTUBE" && (
          <div>
            <label>유튜브 URL</label>
            <input
              type="text"
              name="youtubeUrl"
              value={form.youtubeUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{ width: "100%", padding: "10px", marginTop: "8px" }}
              required
            />
          </div>
        )}

        {(form.type === "PHOTO" || form.type === "GALLERY") && (
          <div>
            <label>이미지 파일</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "block", marginTop: "8px" }}
            />

            {selectedFiles.length > 0 && (
              <p style={{ marginTop: "8px" }}>
                선택된 파일: {selectedFiles.length}개
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            border: "none",
            background: "#222",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "등록 중..." : "게시글 등록"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
}