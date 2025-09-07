import express from "express";
import {
  uploadFile,
  getFiles,
  getFileDetails,
  downloadFile,
  previewFile,
} from "../controllers/fileController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerConfig.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/upload", isAuthenticated, upload.single("file"), uploadFile);

router.get("/", getFiles);
router.get("/:fileId", getFileDetails);
router.get("/:fileId/download", downloadFile);
router.get("/:fileId/preview", previewFile);

export default router;
