const photoPosts = Array.from({ length: 40 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    title: `활동 사진 ${id}`,
    content: `활동 사진 게시글 ${id}의 내용입니다. (나중에 실제 내용으로 교체)`,
    createdAt: `2026-03-${String((id % 28) + 1).padStart(2, "0")}`,
    thumbnail: `https://picsum.photos/seed/photo-${id}/800/600`,
    images: [
      `https://picsum.photos/seed/photo-${id}-1/1200/900`,
      `https://picsum.photos/seed/photo-${id}-2/1200/900`,
      `https://picsum.photos/seed/photo-${id}-3/1200/900`,
    ],
  };
});

export default photoPosts;