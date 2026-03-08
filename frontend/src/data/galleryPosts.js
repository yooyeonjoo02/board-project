const galleryPosts = Array.from({ length: 65 }, (_, i) => {
  const id = i + 1;
  const imageCount = 3 + (id % 4); // 3~6장
  const images = Array.from({ length: imageCount }, (_, j) => {
    return `https://picsum.photos/seed/gallery-${id}-${j + 1}/1200/900`;
  });

  return {
    id,
    title: `갤러리 ${id}`,
    content: `갤러리 게시글 ${id}의 설명입니다. (나중에 실제 내용으로 교체)`,
    createdAt: `2026-03-${String((id % 28) + 1).padStart(2, "0")}`,
    thumbnail: `https://picsum.photos/seed/gallery-thumb-${id}/800/800`,
    images,
  };
});

export default galleryPosts;