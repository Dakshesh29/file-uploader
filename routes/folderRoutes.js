// routes/folderRoutes.js
import express from "express";
import {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
} from "../controllers/folderController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", createFolder);
router.get("/", getFolders);
router.put("/:folderId", updateFolder);
router.delete("/:folderId", deleteFolder);

export default router;
