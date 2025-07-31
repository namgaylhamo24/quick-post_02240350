-- Initialize the database with required tables
-- This script will be automatically executed by Prisma migrations

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created by Prisma migrations
-- Run: npx prisma migrate dev --name init
