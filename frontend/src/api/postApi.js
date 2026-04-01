const BASE_URL = "https://board-project-fap6.onrender.com/api/posts";
const UPLOAD_URL = "https://board-project-fap6.onrender.com/api/upload";

export async function getPosts(type) {
  const url = type ? `${BASE_URL}?type=${encodeURIComponent(type)}` : BASE_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("게시글 목록 조회 실패");
  }

  return response.json();
}

export async function getPostById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("게시글 상세 조회 실패");
  }

  return response.json();
}

export async function createPost(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("게시글 등록 실패");
  }

  return response.json();
}

export async function updatePost(id, payload) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("게시글 수정 실패");
  }

  return response.json();
}


export async function deletePost(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("게시글 삭제 실패");
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return { message: "게시글이 삭제되었습니다." };
}



export async function uploadImages(files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드 실패");
  }

  return response.json();
}