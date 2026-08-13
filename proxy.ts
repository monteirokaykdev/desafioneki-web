import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");

  // Usuário já está autenticado
  // e tentou acessar o login
  if (token && isLoginPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Usuário não está autenticado
  // e tentou acessar o dashboard
  if (!token && isDashboard) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
  ],
};