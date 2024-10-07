const multer = require("multer");
const path = require("path");
// Cấu hình multer để lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";
    console.log(req.baseUrl);
    if (req.baseUrl.includes("interest")) {
      uploadPath = path.join(uploadPath, "interest");
    }
    if (req.baseUrl.includes("language")) {
      uploadPath = path.join(uploadPath, "language");
    }
    if (req.baseUrl.includes("religion")) {
      uploadPath = path.join(uploadPath, "religion");
    }
    if (req.baseUrl.includes("setting")) {
      uploadPath = path.join(uploadPath, "setting");
    }
    if (req.baseUrl.includes("api/auth")) {
      uploadPath = path.join(uploadPath, "profile");
    }
    if (req.baseUrl.includes("api/user")) {
      uploadPath = path.join(uploadPath, "profile");
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to validate file types

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = {
  upload,
};
