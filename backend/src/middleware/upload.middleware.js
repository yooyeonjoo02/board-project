import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3.js";

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `posts/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

export default upload;