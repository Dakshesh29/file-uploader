import express from "express";
import {
  uploadFile,
  getFiles,
  getFileDetails,
  downloadFile,
  previewFile,
  searchFiles,
} from "../controllers/fileController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerConfig.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/upload", upload.single("file"), uploadFile);

router.get("/", getFiles);
router.get("/:fileId", getFileDetails);
router.get("/:fileId/download", downloadFile);
router.get("/:fileId/preview", previewFile);
router.get("/search", searchFiles);

export default router;
