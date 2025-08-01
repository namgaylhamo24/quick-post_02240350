"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { BookmarkIcon, LogInIcon, LogOutIcon, UserIcon } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Quick-Post
          </Link>

          <nav className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <>
                <Link href="/bookmarks">
                  <Button variant="ghost" size="sm">
                    <BookmarkIcon className="h-4 w-4 mr-2" />
                    My Bookmarks
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{session.user?.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => signIn()}>
                <LogInIcon className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
