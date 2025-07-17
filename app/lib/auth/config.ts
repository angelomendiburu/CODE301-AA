import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please set NEXTAUTH_SECRET environment variable')
}

import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import { NextAuthConfig } from "next-auth"

const config: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.role = user.role ?? 'user'
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role as string ?? 'user'
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
}

export const { auth, signIn, signOut } = NextAuth(config)
