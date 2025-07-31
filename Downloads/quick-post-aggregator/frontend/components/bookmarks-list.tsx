"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLinkIcon, TrashIcon, CalendarIcon, UserIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Bookmark {
  id: string
  articleId: string
  title: string
  description: string | null
  url: string
  publishedAt: string
  tags: string[]
  coverImage: string | null
  author: string
  createdAt: string
}

export function BookmarksList() {
  const { data: session } = useSession()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (session) {
      fetchBookmarks()
    }
  }, [session])

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookmarks`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data)
      } else {
        throw new Error("Failed to fetch bookmarks")
      }
    } catch (error) {
      toast.error("Failed to load bookmarks")
      console.error("Fetch bookmarks error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (articleId: string) => {
    setDeletingIds((prev) => new Set(prev).add(articleId))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookmarks/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })

      if (response.ok) {
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.articleId !== articleId))
        toast.success("Bookmark removed successfully!")
      } else {
        throw new Error("Failed to delete bookmark")
      }
    } catch (error) {
      toast.error("Failed to remove bookmark")
      console.error("Delete bookmark error:", error)
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(articleId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading bookmarks...</span>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No bookmarks yet</p>
        <p className="text-gray-400">Start exploring articles and save your favorites!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
          {bookmark.coverImage && (
            <div className="relative h-48 w-full">
              <Image
                src={bookmark.coverImage || "/placeholder.svg"}
                alt={bookmark.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          )}

          <CardHeader className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">{bookmark.title}</h3>
            {bookmark.description && <p className="text-gray-600 text-sm line-clamp-3">{bookmark.description}</p>}
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UserIcon className="h-4 w-4" />
              <span>{bookmark.author}</span>
              <CalendarIcon className="h-4 w-4 ml-2" />
              <span>{formatDate(bookmark.publishedAt)}</span>
            </div>

            {bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {bookmark.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {bookmark.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{bookmark.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                Read Article
              </a>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(bookmark.articleId)}
              disabled={deletingIds.has(bookmark.articleId)}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {deletingIds.has(bookmark.articleId) ? "Removing..." : "Remove"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
