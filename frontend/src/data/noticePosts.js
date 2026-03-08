// src/data/noticePosts.js
export const noticePosts = Array.from({ length: 60 }, (_, i) => {
  const id = i + 1;

  return {
    id,
    title: `공지사항 ${id}`,
    content: `공지사항 ${id}의 내용입니다. (나중에 실제 내용으로 교체)`,
    createdAt: `2026-03-${String((id % 28) + 1).padStart(2, "0")}`,
    images: [
      `https://picsum.photos/seed/notice-${id}-1/1200/900`,
      `https://picsum.photos/seed/notice-${id}-2/1200/900`,
      `https://picsum.photos/seed/notice-${id}-3/1200/900`,
    ],
  };
});