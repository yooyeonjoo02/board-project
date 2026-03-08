import { asyncWrap } from "../utils/asyncWrap.js";
import * as postService from "../services/post.service.js";

export const list = asyncWrap(async (req, res) => {
  const type = req.query.type ?? "PHOTO";
  const page = Number(req.query.page ?? 1);
  const size = Number(req.query.size ?? 12);

  const data = await postService.list({ type, page, size });

  res.json(data);
});

export const getById = asyncWrap(async (req, res) => {
  const id = Number(req.params.id);

  const data = await postService.getById(id);

  res.json(data);
});

export const create = asyncWrap(async (req, res) => {
  const created = await postService.create(req.body);

  res.status(201).json(created);
});

export const update = asyncWrap(async (req, res) => {
  const id = Number(req.params.id);

  const updated = await postService.update(id, req.body);

  res.json(updated);
});

export const remove = asyncWrap(async (req, res) => {
  const id = Number(req.params.id);

  await postService.remove(id);

  return res.status(200).json({
    message: "게시글이 삭제되었습니다.",
    id,
  });
});