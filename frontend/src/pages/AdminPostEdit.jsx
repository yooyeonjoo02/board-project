import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost, uploadImages } from "../api/postApi";
import "./AdminPostEdit.css";

export default function AdminPostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "NOTICE",
    youtubeUrl: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await getPostById(id);

        setForm({
          title: post.title || "",
          content: post.content || "",
          type: post.type || "NOTICE",
          youtubeUrl: post.youtubeUrl || "",
        });

        setExistingImages(Array.isArray(post.images) ? post.images : []);
      } catch (error) {
        console.error(error);
        setMessage("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setPageLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  function handleRemoveExistingImage(removeIndex) {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== removeIndex)
    );
  }

  function handleRemoveSelectedFile(removeIndex) {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== removeIndex)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const isImageType = form.type === "PHOTO" || form.type === "GALLERY";

      let nextImages = [...existingImages];

      if (isImageType && selectedFiles.length > 0) {
        const uploadResult = await uploadImages(selectedFiles);
        const uploadedImageUrls = uploadResult.imageUrls || [];
        nextImages = [...existingImages, ...uploadedImageUrls];
      }

      if (!isImageType) {
        nextImages = [];
      }

      const payload = {
        title: form.title,
        content: form.content,
        type: form.type,
        youtubeUrl:
          form.youtubeUrl.trim() === "" ? null : form.youtubeUrl.trim(),
        images: nextImages,
      };

      await updatePost(id, payload);

      setMessage("게시글이 수정되었습니다.");
      navigate("/admin/posts");
    } catch (error) {
      console.error(error);
      setMessage("게시글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return <p>불러오는 중...</p>;
  }

  return (
    <div className="admin-post-edit">
      <h1 className="admin-post-edit__title">관리자 글 수정</h1>

      <form onSubmit={handleSubmit} className="admin-post-edit__form">
        <div className="admin-post-edit__field">
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            className="admin-post-edit__input"
            required
          />
        </div>

        <div className="admin-post-edit__field">
          <label>내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
            rows="8"
            className="admin-post-edit__textarea"
            required
          />
        </div>

        <div className="admin-post-edit__field">
          <label>게시판 타입</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="admin-post-edit__input"
          >
            <option value="NOTICE">NOTICE</option>
            <option value="PHOTO">PHOTO</option>
            <option value="YOUTUBE">YOUTUBE</option>
            <option value="GALLERY">GALLERY</option>
          </select>
        </div>

        {form.type === "YOUTUBE" && (
          <div className="admin-post-edit__field">
            <label>유튜브 URL</label>
            <input
              type="text"
              name="youtubeUrl"
              value={form.youtubeUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="admin-post-edit__input"
              required
            />
          </div>
        )}

        {(form.type === "PHOTO" || form.type === "GALLERY") && (
          <div className="admin-post-edit__field">
            <label>이미지 파일</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="admin-post-edit__file"
            />

            <p className="admin-post-edit__helper">
              사진을 새로 고르면 기존 사진을 덮어쓰는 것이 아니라 추가됩니다.
            </p>

            {existingImages.length > 0 && (
              <div className="admin-post-edit__image-section">
                <p className="admin-post-edit__section-title">현재 이미지</p>
                <div className="admin-post-edit__image-list">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="admin-post-edit__image-card">
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="admin-post-edit__remove-btn"
                      >
                        ×
                      </button>

                      <img
                        src={imageUrl}
                        alt={`current-${index}`}
                        className="admin-post-edit__image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="admin-post-edit__image-section">
                <p className="admin-post-edit__section-title">추가할 이미지</p>
                <div className="admin-post-edit__image-list">
                  {selectedFiles.map((file, index) => {
                    const previewUrl = URL.createObjectURL(file);

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="admin-post-edit__image-card"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedFile(index)}
                          className="admin-post-edit__remove-btn"
                        >
                          ×
                        </button>

                        <img
                          src={previewUrl}
                          alt={`selected-${index}`}
                          className="admin-post-edit__image"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="admin-post-edit__submit-btn"
        >
          {loading ? "수정 중..." : "게시글 수정"}
        </button>
      </form>

      {message && <p className="admin-post-edit__message">{message}</p>}
    </div>
  );
}