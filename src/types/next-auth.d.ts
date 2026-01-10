import NextAuth, { DefaultSession } from "next-auth"

// 1. Estendendo a Sessão (useSession)
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  // 2. Estendendo o Usuário (retorno do authorize)
  interface User {
    id: string
    role: string
  }
}

// 3. Estendendo o Token JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}