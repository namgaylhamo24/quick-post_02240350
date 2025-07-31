import { Router } from "express"
import { z } from "zod"

const router = Router()

const articlesQuerySchema = z.object({
  per_page: z.string().optional().default("20"),
  page: z.string().optional().default("1"),
  tag: z.string().optional(),
})

// GET /api/articles - Proxy to Dev.to API
router.get("/", async (req, res) => {
  try {
    const query = articlesQuerySchema.parse(req.query)

    const searchParams = new URLSearchParams({
      per_page: query.per_page,
      page: query.page,
      ...(query.tag && { tag: query.tag }),
    })

    const response = await fetch(`https://dev.to/api/articles?${searchParams}`, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Quick-Post-Aggregator/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Dev.to API responded with status: ${response.status}`)
    }

    const articles = await response.json()

    // Add cache headers
    res.set("Cache-Control", "public, max-age=300") // 5 minutes
    res.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    res.status(500).json({
      error: "Failed to fetch articles",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

export { router as articlesRouter }
