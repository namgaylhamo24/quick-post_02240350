export async function sendMagicLink(email: string, token: string) {
  const magicLinkUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`

  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log("\n🔗 Magic Link for", email)
    console.log("Click here to sign in:", magicLinkUrl)
    console.log("Copy and paste this URL in your browser to sign in\n")
    return
  }

  // In production, you would send actual email here
  // Example with nodemailer:
  /*
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT!),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Sign in to Quick-Post',
    html: `
      <h2>Sign in to Quick-Post</h2>
      <p>Click the link below to sign in:</p>
      <a href="${magicLinkUrl}">Sign In</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  })
  */
}
