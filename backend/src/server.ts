import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import { articlesRouter } from "./routes/articles"
import { bookmarksRouter } from "./routes/bookmarks"
import { authRouter } from "./routes/auth"
import { errorHandler } from "./middleware/errorHandler"
import { authMiddleware } from "./middleware/auth"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Routes
app.use("/api/articles", articlesRouter)
app.use("/api/auth", authRouter)
app.use("/api/bookmarks", authMiddleware, bookmarksRouter)

// Error handling
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})
