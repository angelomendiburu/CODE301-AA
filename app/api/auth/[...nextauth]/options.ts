import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

import { NextAuthOptions, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomJWT extends JWT {
  role?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || '' }
      });

      if (user.email === 'angelomendiburu@gmail.com') {
        if (existingUser) {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: 'admin' }
          });
        } else {
          // Si el usuario no existe, créalo con el rol de admin
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              role: 'admin',
              image: user.image
            }
          });
        }
      } else if (!existingUser) {
        // Si es un nuevo usuario que no es admin, asignarle el rol de usuario
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            role: 'user',
            image: user.image
          }
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  }
}
