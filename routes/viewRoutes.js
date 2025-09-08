import express from "express";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/login", (req, res) => {
  res.render("login", { error: req.flash("error") });
});

router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;

    const [folders, files] = await Promise.all([
      prisma.folder.findMany({ where: { userId } }),
      prisma.file.findMany({ where: { userId } }),
    ]);

    res.render("dashboard", { user: req.user, folders, files });
  } catch (error) {
    res.status(500).send("Error loading dashboard");
  }
});

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/register");
  }
});

export default router;
