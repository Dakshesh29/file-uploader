import { PrismaClient } from "@prisma/client";

import { formatInTimeZone } from "date-fns-tz";

const prisma = new PrismaClient();

export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;
  const userId = req.user.id;

  try {
    const newFolder = await prisma.folder.create({
      data: {
        name,
        userId,
        parentId,
      },
    });
    res.status(201).json(newFolder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating folder", error: error.message });
  }
};

export const getFolders = async (req, res) => {
  const userId = req.user.id;
  try {
    const folders = await prisma.folder.findMany({
      where: { userId },
    });
    const formattedFolders = folders.map((folder) => {
      return {
        ...folder,
        createdAt: formatInTimeZone(
          folder.createdAt,
          "Asia/Kolkata",
          "yyyy-MM-dd HH:mm:ss zzz"
        ),
        updatedAt: formatInTimeZone(
          folder.updatedAt,
          "Asia/Kolkata",
          "yyyy-MM-dd HH:mm:ss zzz"
        ),
      };
    });
    res.status(200).json(folders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching folders", error: error.message });
  }
};

export const updateFolder = async (req, res) => {
  const { folderId } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
        userId: userId,
      },
      data: { name },
    });
    res.status(200).json(updatedFolder);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Folder not found or you do not have permission to update it.",
      });
    }
    res
      .status(500)
      .json({ message: "Error updating folder", error: error.message });
  }
};

export const deleteFolder = async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user.id;

  try {
    await prisma.folder.delete({
      where: {
        id: folderId,
        userId: userId,
      },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Folder not found or you do not have permission to delete it.",
      });
    }
    res
      .status(500)
      .json({ message: "Error deleting folder", error: error.message });
  }
};
