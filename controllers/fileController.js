import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const { folderId } = req.body;
    const userId = req.user.id;

    const newFile = await prisma.file.create({
      data: {
        originalName: req.file.originalname,
        storageName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        fileUrl: `/${req.file.path}`,
        userId,
        folderId,
      },
    });

    res.status(201).json(newFile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};
