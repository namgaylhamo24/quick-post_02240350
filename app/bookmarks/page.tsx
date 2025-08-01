import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/header"
import { BookmarksList } from "@/components/bookmarks-list"

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookmarks</h1>
          <p className="text-gray-600">Your saved articles from Dev.to</p>
        </div>
        <BookmarksList />
      </main>
    </div>
  )
}
