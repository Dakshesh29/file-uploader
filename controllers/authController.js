import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const userResponse = { id: user.id, email: user.email };

    res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
