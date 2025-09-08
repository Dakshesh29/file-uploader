import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.render("register", {
        error: "User with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.redirect("/login");
  } catch (error) {
    res.render("register", { error: "Server error. Please try again." });
  }
};
export const loginUser = (req, res) => {
  res.status(200).json({
    message: "Logged in successfully",
    user: { id: req.user.id, email: req.user.email },
  });
};

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};
