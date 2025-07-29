import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Adapter } from "next-auth/adapters"
import bcrypt from "bcrypt"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.hashedPassword) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword)

        if (!isValid) {
          return null
        }

        return user
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email === 'admin123@gmail.com' || user.email === 'admin@example.com') {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser && dbUser.role !== 'admin') {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: 'admin' },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
}
