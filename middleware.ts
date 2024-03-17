import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the current session from the cookies, this is the signal to show if the user is login or not
  const session = request.cookies.get("auth_session");

  // Get the url that user trying to access
  const nextUrl = request.nextUrl.pathname;

  // Check if the user is not login and try to access the upload page
  if (nextUrl.startsWith("/upload") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the user is not login and try to access the dashboard page
  if (
    (nextUrl.startsWith("/dashboard") || nextUrl.startsWith("/collection")) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the user is logged in and trying to access the login or register page
  if (
    (nextUrl.startsWith("/login") || nextUrl.startsWith("/register")) &&
    session
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
