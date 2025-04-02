import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  const protectedRoutes = ["/commands", "/queue"];
  const currRoute = req.nextUrl.pathname;

  if (protectedRoutes.some((route) => currRoute.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/commands", "/queue"],
};
