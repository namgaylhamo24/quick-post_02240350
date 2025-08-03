import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database with sample data...")

    // Create sample users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: "john.doe@example.com" },
        update: {},
        create: {
          name: "Jigme Dorji",
          email: "jigme.dorji@example.com",
          emailVerified: new Date(),
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        },
      }),
      prisma.user.upsert({
        where: { email: "jane.smith@example.com" },
        update: {},
        create: {
          name: "Jamyang Tenzin",
          email: "jamyang.tenzin@example.com",
          emailVerified: new Date(),
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        },
      }),
      prisma.user.upsert({
        where: { email: "migmer.dorji@example.com" },
        update: {},
        create: {
          name: "Migmer Dorji",
          email: "migmer.dorji@example.com",
          emailVerified: new Date(),
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        },
      }),
      prisma.user.upsert({
        where: { email: "sarah.wilson@example.com" },
        update: {},
        create: {
          name: "Sarah Wilson",
          email: "sarah.wilson@example.com",
          emailVerified: new Date(),
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        },
      }),
      prisma.user.upsert({
        where: { email: "david.brown@example.com" },
        update: {},
        create: {
          name: "David Brown",
          email: "david.brown@example.com",
          emailVerified: null,
          image: null,
        },
      }),
    ])

    console.log(`✅ Created ${users.length} users`)

    // Get user IDs for bookmarks
    const jigmeUser = users[0]
    const jamyangUser = users[1]
    const migmerUser = users[2]
    const sarahUser = users[3]

    // Create sample bookmarks
    const bookmarks = [
      {
        userId: jigmeUser.id,
        articleId: "1234567",
        title: "Getting Started with React Hooks",
        description:
          "A comprehensive guide to understanding and using React Hooks in your applications. Learn about useState, useEffect, and custom hooks.",
        url: "https://dev.to/example/getting-started-with-react-hooks-1234567",
        publishedAt: new Date("2024-01-15T10:30:00Z"),
        tags: ["react", "javascript", "hooks", "frontend"],
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        author: "Alex Developer",
      },
      {
        userId: jamyangUser.id,
        articleId: "2345678",
        title: "Building REST APIs with Node.js and Express",
        description:
          "Learn how to create robust REST APIs using Node.js and Express framework. Includes authentication, validation, and best practices.",
        url: "https://dev.to/example/building-rest-apis-nodejs-express-2345678",
        publishedAt: new Date("2024-01-20T14:45:00Z"),
        tags: ["nodejs", "express", "api", "backend"],
        coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
        author: "Backend Master",
      },
      {
        userId: jigmeUser.id,
        articleId: "3456789",
        title: "CSS Grid vs Flexbox: When to Use Which",
        description:
          "A detailed comparison between CSS Grid and Flexbox layouts. Understand the strengths and use cases for each approach.",
        url: "https://dev.to/example/css-grid-vs-flexbox-3456789",
        publishedAt: new Date("2024-01-18T09:15:00Z"),
        tags: ["css", "grid", "flexbox", "layout"],
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        author: "CSS Guru",
      },
      {
        userId: jigmeUser.id,
        articleId: "4567890",
        title: "Introduction to TypeScript for JavaScript Developers",
        description:
          "Make the transition from JavaScript to TypeScript with this beginner-friendly guide. Covers types, interfaces, and best practices.",
        url: "https://dev.to/example/intro-typescript-js-developers-4567890",
        publishedAt: new Date("2024-01-22T16:20:00Z"),
        tags: ["typescript", "javascript", "programming", "tutorial"],
        coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
        author: "Type Expert",
      },
      {
        userId: migmerUser.id,
        articleId: "5678901",
        title: "Docker for Beginners: Containerizing Your Applications",
        description:
          "Learn the basics of Docker and how to containerize your applications for consistent deployment across environments.",
        url: "https://dev.to/example/docker-beginners-guide-5678901",
        publishedAt: new Date("2024-01-25T11:30:00Z"),
        tags: ["docker", "containers", "devops", "deployment"],
        coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
        author: "DevOps Pro",
      },
      {
        userId: migmerUser.id,
        articleId: "6789012",
        title: "Understanding Database Relationships and Normalization",
        description:
          "Deep dive into database design principles, relationships, and normalization techniques for efficient data storage.",
        url: "https://dev.to/example/database-relationships-normalization-6789012",
        publishedAt: new Date("2024-01-23T13:45:00Z"),
        tags: ["database", "sql", "design", "normalization"],
        coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
        author: "DB Architect",
      },
      {
        userId: sarahUser.id,
        articleId: "7890123",
        title: "Modern JavaScript ES2024 Features You Should Know",
        description:
          "Explore the latest JavaScript features introduced in ES2024, including new syntax and improved functionality.",
        url: "https://dev.to/example/modern-js-es2024-features-7890123",
        publishedAt: new Date("2024-01-26T08:00:00Z"),
        tags: ["javascript", "es2024", "modern", "features"],
        coverImage: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
        author: "JS Ninja",
      },
      {
        userId: sarahUser.id,
        articleId: "8901234",
        title: "Building Responsive Web Design with Tailwind CSS",
        description:
          "Master responsive design using Tailwind CSS utility classes. Learn mobile-first approach and advanced techniques.",
        url: "https://dev.to/example/responsive-design-tailwind-8901234",
        publishedAt: new Date("2024-01-24T15:30:00Z"),
        tags: ["tailwindcss", "responsive", "css", "design"],
        coverImage: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800",
        author: "Design Wizard",
      },
    ]

    for (const bookmark of bookmarks) {
      await prisma.bookmark.upsert({
        where: {
          userId_articleId: {
            userId: bookmark.userId,
            articleId: bookmark.articleId,
          },
        },
        update: {},
        create: bookmark,
      })
    }

    console.log(`✅ Created ${bookmarks.length} bookmarks`)

    // Create sample sessions
    const sessions = [
      {
        sessionToken: "session_token_abc123",
        userId: jigmeUser.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        sessionToken: "session_token_def456",
        userId: jamyangUser.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        sessionToken: "session_token_ghi789",
        userId: migmerUser.id,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      },
      {
        sessionToken: "session_token_jkl012",
        userId: sarahUser.id,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      },
    ]

    for (const session of sessions) {
      await prisma.session.upsert({
        where: { sessionToken: session.sessionToken },
        update: {},
        create: session,
      })
    }

    console.log(`✅ Created ${sessions.length} sessions`)

    // Create sample verification tokens
    const verificationTokens = [
      {
        identifier: "jigme.dorji@example.com",
        token: "verify_token_123abc",
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
      {
        identifier: "new.user@example.com",
        token: "verify_token_456def",
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
      {
        identifier: "test.user@example.com",
        token: "verify_token_789ghi",
        expires: new Date(Date.now() - 5 * 60 * 1000), // Expired token (5 minutes ago)
      },
    ]

    for (const token of verificationTokens) {
      await prisma.verificationToken.upsert({
        where: {
          identifier_token: {
            identifier: token.identifier,
            token: token.token,
          },
        },
        update: {},
        create: token,
      })
    }

    console.log(`✅ Created ${verificationTokens.length} verification tokens`)

    // Create sample accounts
    const accounts = [
      {
        userId: jigmeUser.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "google_123456",
        access_token: "ya29.example_access_token_1",
        token_type: "Bearer",
      },
      {
        userId: jamyangUser.id,
        type: "oauth",
        provider: "github",
        providerAccountId: "github_789012",
        access_token: "ghp_example_access_token_2",
        token_type: "Bearer",
      },
      {
        userId: migmerUser.id,
        type: "email",
        provider: "email",
        providerAccountId: "mike.johnson@example.com",
      },
      {
        userId: sarahUser.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "google_345678",
        access_token: "ya29.example_access_token_3",
        token_type: "Bearer",
      },
    ]

    for (const account of accounts) {
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        update: {},
        create: account,
      })
    }

    console.log(`✅ Created ${accounts.length} accounts`)

    // Display summary
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.bookmark.count(),
      prisma.session.count(),
      prisma.verificationToken.count(),
      prisma.account.count(),
    ])

    console.log("\n📊 Database Summary:")
    console.log(`👥 Users: ${counts[0]}`)
    console.log(`🔖 Bookmarks: ${counts[1]}`)
    console.log(`🔐 Sessions: ${counts[2]}`)
    console.log(`🎫 Verification Tokens: ${counts[3]}`)
    console.log(`📱 Accounts: ${counts[4]}`)

    console.log("\n🎉 Database seeding completed successfully!")
    console.log("🔍 You can view the data at: http://localhost:5555 (run 'npx prisma studio')")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding function
seedDatabase()