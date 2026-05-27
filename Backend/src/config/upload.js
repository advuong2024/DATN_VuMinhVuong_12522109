const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
const PDF_TYPES = ["application/pdf"];
const ALLOWED = [...IMAGE_TYPES, ...VIDEO_TYPES, ...PDF_TYPES];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF), PDF hoặc video (MP4, WebM, MOV, AVI, MKV)"), false);
  }
};

const isVideo = (mimetype) => mimetype.startsWith("video/");

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = { upload, isVideo };
