import { Router } from "express";
import * as postController from "../controllers/post.controller.js";

const router = Router();

// 목록 (type, paging)
router.get("/", postController.list);

// 상세
router.get("/:id", postController.getById);

// 생성
router.post("/", postController.create);

// 수정
router.put("/:id", postController.update);

// 삭제
router.delete("/:id", postController.remove);

export default router;