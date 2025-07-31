import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://dev.to/api/articles?per_page=20", {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error("Failed to fetch articles")
    }

    const articles = await response.json()
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
