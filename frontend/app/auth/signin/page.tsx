"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MailIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"



export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "http://localhost:3000"
    })

    setLoading(false)

    if (result?.error) {
      setError("Failed to send magic link. Please try again.")
    } else {
      router.push("/auth/check-email")
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your email to receive a magic link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send magic link"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
