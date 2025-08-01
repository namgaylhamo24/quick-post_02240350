import { Router } from "express"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"
import { sendMagicLink } from "../services/email"

const router = Router()

const magicLinkSchema = z.object({
  email: z.string().email(),
})

const verifyTokenSchema = z.object({
  token: z.string(),
})

// POST /api/auth/magic-link - Send magic link
router.post("/magic-link", async (req, res) => {
  try {
    const { email } = magicLinkSchema.parse(req.body)

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          emailVerified: null,
        },
      })
    }

    // Generate magic link token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "15m" })

    // Create verification token in database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    })

    // Send magic link (in development, log to console)
    await sendMagicLink(email, token)

    res.json({ message: "Magic link sent successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid email address" })
    }

    console.error("Error sending magic link:", error)
    res.status(500).json({ error: "Failed to send magic link" })
  }
})

// POST /api/auth/verify - Verify magic link token
router.post("/verify", async (req, res) => {
  try {
    const { token } = verifyTokenSchema.parse(req.body)

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Check if token exists in database and is not expired
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token" })
    }

    // Update user as verified
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailVerified: new Date() },
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    // Generate access token
    const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
      accessToken,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: "Invalid token" })
    }

    console.error("Error verifying token:", error)
    res.status(500).json({ error: "Failed to verify token" })
  }
})

export { router as authRouter }
