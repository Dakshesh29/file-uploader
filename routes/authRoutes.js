import express from "express";
import { registerUser } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  registerUser
);

export default router;
