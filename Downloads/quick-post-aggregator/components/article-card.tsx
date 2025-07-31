"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookmarkIcon, ExternalLinkIcon, CalendarIcon, UserIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Article {
  id: number
  title: string
  description: string
  url: string
  published_at: string
  tag_list: string[]
  cover_image: string | null
  user: {
    name: string
    username: string
    profile_image: string
  }
}

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { data: session } = useSession()
  const [isBookmarking, setIsBookmarking] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleBookmark = async () => {
    if (!session) {
      toast.error("Please sign in to bookmark articles")
      return
    }

    setIsBookmarking(true)

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId: article.id,
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.published_at,
          tags: article.tag_list,
          coverImage: article.cover_image,
          author: article.user.name,
        }),
      })

      if (response.ok) {
        setIsBookmarked(true)
        toast.success("Article bookmarked successfully!")
      } else if (response.status === 409) {
        toast.info("Article is already bookmarked")
        setIsBookmarked(true)
      } else {
        throw new Error("Failed to bookmark article")
      }
    } catch (error) {
      toast.error("Failed to bookmark article")
      console.error("Bookmark error:", error)
    } finally {
      setIsBookmarking(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {article.cover_image && (
        <div className="relative h-48 w-full">
          <Image
            src={article.cover_image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      )}

      <CardHeader className="flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{article.title}</h3>
        {article.description && <p className="text-gray-600 text-sm line-clamp-3">{article.description}</p>}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <UserIcon className="h-4 w-4" />
          <span>{article.user.name}</span>
          <CalendarIcon className="h-4 w-4 ml-2" />
          <span>{formatDate(article.published_at)}</span>
        </div>

        {article.tag_list.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tag_list.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tag_list.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tag_list.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon className="h-4 w-4 mr-2" />
            Read Article
          </a>
        </Button>

        <Button
          variant={isBookmarked ? "default" : "outline"}
          size="sm"
          onClick={handleBookmark}
          disabled={isBookmarking || isBookmarked}
        >
          <BookmarkIcon className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
          {isBookmarking ? "Saving..." : isBookmarked ? "Saved" : "Bookmark"}
        </Button>
      </CardFooter>
    </Card>
  )
}
