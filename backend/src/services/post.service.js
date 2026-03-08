import * as postRepo from "../repositories/post.repo.js";

const ALLOWED_TYPES = new Set(["PHOTO", "YOUTUBE", "NOTICE", "GALLERY"]);

function assertType(type) {
  if (!ALLOWED_TYPES.has(type)) {
    const err = new Error(`Invalid type: ${type}`);
    err.status = 400;
    throw err;
  }
}

function assertTitle(title) {
  if (!title || String(title).trim().length === 0) {
    const err = new Error("title is required");
    err.status = 400;
    throw err;
  }
}

function normalizeImages(images) {
  // undefined/null -> null(= 변경 없음), 배열이면 trim 후 빈 값 제거
  if (images === undefined) return undefined;
  if (images === null) return [];
  if (!Array.isArray(images)) {
    const err = new Error("images must be an array of strings");
    err.status = 400;
    throw err;
  }

  const normalized = images
    .map((x) => (x == null ? "" : String(x).trim()))
    .filter((x) => x.length > 0);

  return normalized;
}

export async function list({ type, page, size }) {
  const safeType = type ?? "PHOTO";
  assertType(safeType);

  const safePage = Number(page ?? 1);
  const safeSize = Number(size ?? 12);

  if (safePage < 1 || safeSize < 1) {
    const err = new Error("page/size must be >= 1");
    err.status = 400;
    throw err;
  }

  const offset = (safePage - 1) * safeSize;

  const [items, total] = await Promise.all([
    postRepo.findMany({ type: safeType, limit: safeSize, offset }),
    postRepo.countByType(safeType),
  ]);

  return { items, page: safePage, size: safeSize, total };
}

export async function getById(id) {
  const post = await postRepo.findById(id);
  if (!post) {
    const err = new Error("Post not found");
    err.status = 404;
    throw err;
  }
  return post;
}

export async function create(body) {
  const { type, title, content, youtubeUrl, images } = body;

  assertType(type);
  assertTitle(title);

  if (type === "YOUTUBE" && !youtubeUrl) {
    const err = new Error("youtubeUrl is required for YOUTUBE type");
    err.status = 400;
    throw err;
  }

  const normalizedImages = normalizeImages(images);

  // 1) posts 기본 레코드 생성
  const created = await postRepo.insert({
    type,
    title,
    content: content ?? null,
    youtubeUrl: youtubeUrl ?? null,
  });

  // 2) images[]가 있으면 post_images에 저장
  if (Array.isArray(normalizedImages) && normalizedImages.length > 0) {
    await postRepo.insertImages(created.id, normalizedImages);
  }

  // 3) 상세 형태로 반환(= images 포함)
  return await postRepo.findById(created.id);
}

export async function update(id, body) {
  const existing = await postRepo.findById(id);
  if (!existing) {
    const err = new Error("Post not found");
    err.status = 404;
    throw err;
  }

  // ✅ 기존 방식 유지: 들어온 값만 덮어쓰기
  const next = {
    type: body.type ?? existing.type,
    title: body.title ?? existing.title,
    content: body.content ?? existing.content,
    youtubeUrl: body.youtubeUrl ?? existing.youtubeUrl,
  };

  assertType(next.type);
  assertTitle(next.title);

  if (next.type === "YOUTUBE" && !next.youtubeUrl) {
    const err = new Error("youtubeUrl is required for YOUTUBE type");
    err.status = 400;
    throw err;
  }

  // 1) posts 업데이트
  await postRepo.update(id, next);

  // 2) images 업데이트 (넘어온 경우에만 처리)
  const normalizedImages = normalizeImages(body.images);
  if (normalizedImages !== undefined) {
    // images: [] 로 보내면 "이미지 전부 삭제" 의미
    await postRepo.removeImages(id);
    if (normalizedImages.length > 0) {
      await postRepo.insertImages(id, normalizedImages);
    }
  }

  // 3) 상세 형태로 반환
  return await postRepo.findById(id);
}

export async function remove(id) {
  const existing = await postRepo.findById(id);
  if (!existing) {
    const err = new Error("Post not found");
    err.status = 404;
    throw err;
  }

  await postRepo.remove(id);
}