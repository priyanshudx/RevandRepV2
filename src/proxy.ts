import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_USER_ROUTES = ["/dashboard", "/questionnaire", "/payment"];

// Routes that require admin access
const PROTECTED_ADMIN_ROUTES = ["/admin"];

// Routes accessible to unauthenticated users only (redirect if authed)
const AUTH_ONLY_ROUTES = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth state is managed client-side via Firebase + cookies.
  // We use a lightweight session cookie set after server-side verification.
  const sessionCookie = request.cookies.get("rev-rep-session");
  const adminCookie = request.cookies.get("rev-rep-admin");
  const isAuthenticated = !!sessionCookie?.value;
  const isAdmin = !!adminCookie?.value;

  // Redirect unauthenticated users away from protected user & admin routes
  const isProtectedUser = PROTECTED_USER_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedAdmin = PROTECTED_ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if ((isProtectedUser || isProtectedAdmin) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already authenticated users away from auth-only routes
  const isAuthOnly = AUTH_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isAuthOnly && isAuthenticated) {
    const target = isAdmin ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - api/webhooks (webhook endpoints must be always accessible)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/webhooks).*)",
  ],
};
