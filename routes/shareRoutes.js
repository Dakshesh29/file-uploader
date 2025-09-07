import express from "express";
import { accessSharedFolder } from "../controllers/shareController.js";

const router = express.Router();

router.get("/:shareId", accessSharedFolder);

export default router;
