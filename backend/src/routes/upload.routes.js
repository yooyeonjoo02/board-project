import express from "express";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", upload.array("images", 10), (req, res) => {
  const imageUrls = (req.files || []).map((file) => file.location);

  res.json({
    message: "upload success",
    imageUrls,
  });
});

export default router;