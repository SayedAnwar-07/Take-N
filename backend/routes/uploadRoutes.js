import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ Ensure "uploads/" folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpe?g|png|webp/;
  if (allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image"); // ✅ Ensure this matches frontend

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    console.log("Received File:", req.file); // ✅ Debugging

    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "Image uploaded successfully",
      image: `/uploads/${req.file.filename}`,
    });
  });
});

export default router;
