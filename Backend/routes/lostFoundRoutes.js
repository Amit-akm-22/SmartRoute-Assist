import express from "express";
import multer from "multer";
import {
  createLostFound,
  getLostFoundItems,
} from "../controllers/lostFoundController.js";
import { authenticateClient } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", authenticateClient, upload.single("image"), createLostFound);
router.get("/get", getLostFoundItems);

export default router;
