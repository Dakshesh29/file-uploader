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

    const { folderId, tags } = req.body;
    const userId = req.user.id;

    const tagNames = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    const newFile = await prisma.$transaction(async (tx) => {
      // Create or find tags
      const tagOperations = tagNames.map((name) =>
        tx.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      );
      const createdOrFoundTags = await Promise.all(tagOperations);

      // Create file with tag associations
      const file = await tx.file.create({
        data: {
          originalName: req.file.originalname,
          storageName: req.file.filename,
          mimeType: req.file.mimetype,
          size: req.file.size,
          fileUrl: `/${req.file.path}`,
          userId,
          folderId,
          tags: {
            connect: createdOrFoundTags.map((tag) => ({ id: tag.id })),
          },
        },
        include: { tags: true },
      });

      return file;
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
    const files = await prisma.file.findMany({
      where: { userId },
      include: { tags: true },
    });
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
    const file = await prisma.file.findFirst({
      where: { id: fileId, userId },
      include: { tags: true },
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
    const file = await prisma.file.findFirst({
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
    const file = await prisma.file.findFirst({
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

export const searchFiles = async (req, res) => {
  const { q } = req.query;
  const userId = req.user.id;

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const files = await prisma.file.findMany({
      where: {
        userId,
        OR: [
          {
            originalName: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            tags: {
              some: {
                name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        tags: true,
      },
    });
    res.status(200).json(files);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching files", error: error.message });
  }
};
