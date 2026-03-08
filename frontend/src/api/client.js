const BASE_URL = "http://localhost:4000";

export async function fetchPosts(type = "PHOTO", page = 1, size = 12) {
  const qs = new URLSearchParams({ type, page, size });
  const res = await fetch(`${BASE_URL}/api/posts?${qs.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // { items, page, size, total }
}

export async function fetchPostById(id) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}