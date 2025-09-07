// routes/folderRoutes.js
import express from "express";
import {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
  createShareLink,
} from "../controllers/folderController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", createFolder);
router.get("/", getFolders);
router.put("/:folderId", updateFolder);
router.delete("/:folderId", deleteFolder);
router.post("/:folderId/share", createShareLink);

export default router;
