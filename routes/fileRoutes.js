import express from "express";
import { uploadFile } from "../controllers/fileController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerConfig.js";

const router = express.Router();

router.post("/upload", isAuthenticated, upload.single("file"), uploadFile);

export default router;
