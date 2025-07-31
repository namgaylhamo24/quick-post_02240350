import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MailIcon } from "lucide-react"
import Link from "next/link"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MailIcon className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>A sign in link has been sent to your email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            For development purposes, the magic link has been logged to the console. Check your browser's developer
            console and copy the URL to sign in.
          </p>
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/">Return to homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
