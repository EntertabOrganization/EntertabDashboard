import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/users", "/contact-us", "/services", "/projects", "/journeys"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("entertab_token")?.value;
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPaths.some((path) => pathname.startsWith(path));

  if (needsAuth && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/users/:path*", "/contact-us/:path*", "/services/:path*", "/projects/:path*", "/journeys/:path*"]
};
