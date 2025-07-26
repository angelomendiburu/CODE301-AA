import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Adapter } from "next-auth/adapters"

import { NextAuthOptions, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomJWT extends JWT {
  role: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (user.email === 'angelomendiburu@gmail.com' && user.email) {
          // Dar tiempo para que el usuario se cree primero
          setTimeout(async () => {
            try {
              const existingUser = await prisma.user.findUnique({
                where: { email: user.email! }
              });

              if (existingUser && existingUser.role !== 'admin') {
                await prisma.user.update({
                  where: { email: user.email! },
                  data: { role: 'admin' }
                });
                console.log('Rol de admin establecido para:', user.email);
              }
            } catch (error) {
              console.error('Error updating user role after creation:', error);
            }
          }, 1000); // Esperar 1 segundo para que se complete la creación
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true;
      }
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
        
        // Establecer rol de admin si es el email específico
        if (session.user.email === 'angelomendiburu@gmail.com') {
          session.user.role = 'admin';
          
          // También actualizar en la base de datos si existe
          try {
            const existingUser = await prisma.user.findUnique({
              where: { email: session.user.email }
            });
            
            if (existingUser && existingUser.role !== 'admin') {
              await prisma.user.update({
                where: { email: session.user.email },
                data: { role: 'admin' }
              });
            }
          } catch (error) {
            console.error('Error updating user role in session:', error);
          }
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa o del mismo origen, permitirla
      if (url.startsWith("/") || url.startsWith(baseUrl)) {
        return url;
      }
      
      // Por defecto, redirigir directamente a admin/metrics para el admin
      return baseUrl + "/admin/metrics";
    }
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
