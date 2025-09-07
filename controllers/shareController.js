import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const accessSharedFolder = async (req, res) => {
  const { shareId } = req.params;
  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: {
        id: shareId,
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        folder: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!shareLink) {
      return res
        .status(404)
        .json({ message: "Link not found or has expired." });
    }
    res.status(200).json(shareLink.folder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accessing shared link", error: error.message });
  }
};
