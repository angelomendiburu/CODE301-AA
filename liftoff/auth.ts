import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL ya es una ruta interna, usarla
      if (url.startsWith(baseUrl)) {
        const path = url.substring(baseUrl.length);
        if (path === '/api/auth/signin' || path === '/api/auth/callback/google') {
          // Aquí obtenemos el rol del usuario
          const session = await prisma.user.findFirst({
            where: {
              email: token?.email,
            },
            select: {
              role: true,
            },
          });
          
          if (session?.role === 'admin') {
            return `${baseUrl}/admin/metrics`;
          }
          return `${baseUrl}/mi-proyecto`;
        }
      }
      return url;
    },
  },
}
