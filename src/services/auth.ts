import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import PostgresAdapter from "@auth/pg-adapter"
import { Adapter } from "next-auth/adapters"
import pool from "@/lib/db"
import { z } from "zod"
import LocalCredential from "@/lib/local-credential"

// Definimos o schema fora para reutilizar
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export const authOptions: NextAuthOptions = {
  // Casting necessário porque a tipagem do Adapter v4 vs driver PG às vezes conflita
  adapter: PostgresAdapter(pool) as Adapter,

  secret: process.env.NEXTAUTH_SECRET,
  
  session: {
    strategy: "jwt", // Obrigatório para Credentials + DB
  },
  
  pages: {
    signIn: "/admin/login",
  },

  providers: [
    LocalCredential()
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  }
}