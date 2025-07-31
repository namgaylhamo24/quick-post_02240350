import { ArticleGrid } from "@/components/article-grid"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quick-Post Content Aggregator</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover and bookmark the latest articles from Dev.to. Sign in to save your favorite posts and build your
            personal reading list.
          </p>
        </div>
        <ArticleGrid />
      </main>
    </div>
  )
}
