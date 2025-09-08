import express from "express";
import passport from "passport";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
const router = express.Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  registerUser
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/logout", logoutUser);

router.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "This is a protected route", user: req.user });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to view this page" });
  }
});

export default router;
