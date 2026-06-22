import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/mapa", "/propiedades", "/precios", "/planes", "/api/properties", "/api/zones"];
const adminRoutes = ["/admin"];
const ownerRoutes = ["/dashboard/propiedades/nueva"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (
    publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"))
  ) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (adminRoutes.some((r) => pathname.startsWith(r)) && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    ownerRoutes.some((r) => pathname.startsWith(r)) &&
    role !== "owner" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons).*)"],
};
