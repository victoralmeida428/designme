import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Proteção extra de Admin
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      // Redireciona user comum tentando acessar area admin
      return NextResponse.redirect(new URL("/", req.url)) 
    }
  },
  {
    callbacks: {
      // Retorna true se o usuário está autorizado a carregar a página
      authorized: ({ token }) => !!token, 
    },
    pages: {
      signIn: "/admin/login",
    }
  }
)

export const config = {
  // Defina aqui APENAS as rotas que PRECISAM de proteção
  // O withAuth funciona como uma "blocklist" (lista de bloqueio)
  matcher: [
    "/admin/:path*", 
    "/api/admin/:path*",
  ]
}