import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const getFiles = async (req, res) => {
  const userId = req.user.id;
  try {
    const files = await prisma.file.findMany({ where: { userId } });
    res.status(200).json(files);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching files", error: error.message });
  }
};

export const getFileDetails = async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.id;
  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId, userId },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json(file);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching file details", error: error.message });
  }
};

export const downloadFile = async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.id;
  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId, userId },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", "uploads", file.storageName);

    res.download(filePath, file.originalName, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error downloading the file.");
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing file download",
      error: error.message,
    });
  }
};

export const previewFile = async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.id;

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId, userId },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", "uploads", file.storageName);

    const previewableTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
    ];

    if (previewableTypes.includes(file.mimeType)) {
      res.sendFile(filePath);
    } else {
      res.download(filePath, file.originalName);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing file preview", error: error.message });
  }
};
