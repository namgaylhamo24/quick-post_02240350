import type { Request, Response, NextFunction } from "express"

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error("Unhandled error:", error)

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development"

  res.status(500).json({
    error: "Internal server error",
    ...(isDevelopment && { details: error.message, stack: error.stack }),
  })
}
