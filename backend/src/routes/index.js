import { Router } from "express";
import postRoutes from "./post.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.use("/posts", postRoutes);
router.use("/upload", uploadRoutes);

export default router;