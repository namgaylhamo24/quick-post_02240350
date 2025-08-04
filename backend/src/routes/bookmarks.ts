import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import type { AuthenticatedRequest } from "../types/auth"

const router = Router()

const createBookmarkSchema = z.object({
  articleId: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string().url(),
  publishedAt: z.string().datetime(),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().url().nullable(),
  author: z.string(),
})

// GET /api/bookmarks - Get user's bookmarks
router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    res.json(bookmarks)
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    res.status(500).json({ error: "Failed to fetch bookmarks" })
  }
})

// POST /api/bookmarks - Create a bookmark
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id
    const data = createBookmarkSchema.parse(req.body)

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: data.articleId.toString(),
        },
      },
    })

    if (existingBookmark) {
      return res.status(409).json({ error: "Article already bookmarked" })
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        articleId: data.articleId.toString(),
        title: data.title,
        description: data.description,
        url: data.url,
        publishedAt: new Date(data.publishedAt),
        tags: data.tags,
        coverImage: data.coverImage,
        author: data.author,
      },
    })

    res.status(201).json(bookmark)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.errors })
    }

    console.error("Error creating bookmark:", error)
    res.status(500).json({ error: "Failed to create bookmark" })
  }
})

// DELETE /api/bookmarks/:articleId - Delete a bookmark
router.delete(":articleId", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id
    const { articleId } = req.params

    // Find and verify ownership
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    })

    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" })
    }

    await prisma.bookmark.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    })

    res.json({ message: "Bookmark deleted successfully" })
  } catch (error) {
    console.error("Error deleting bookmark:", error)
    res.status(500).json({ error: "Failed to delete bookmark" })
  }
})

export { router as bookmarksRouter }
