import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { articleId, title, description, url, publishedAt, tags, coverImage, author } = body

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId: articleId.toString(),
        },
      },
    })

    if (existingBookmark) {
      return NextResponse.json({ error: "Article already bookmarked" }, { status: 409 })
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        articleId: articleId.toString(),
        title,
        description,
        url,
        publishedAt: new Date(publishedAt),
        tags: tags || [],
        coverImage,
        author,
      },
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    console.error("Error creating bookmark:", error)
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
}
