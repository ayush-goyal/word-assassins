import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (
  request: NextRequest,
  response: NextResponse
) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // List of paths that require authentication (with locale support)
  const protectedPaths = ["/dashboard", "/games", "/account"];
  const pathname = request.nextUrl.pathname;

  // Remove locale prefix if present to check protected paths
  const pathWithoutLocale = pathname.replace(/^\/(en|es)/, "") || "/";

  if (
    !user &&
    protectedPaths.some((path) => pathWithoutLocale.startsWith(path))
  ) {
    // Extract locale from pathname
    const locale = pathname.match(/^\/(en|es)/)?.[1] || "en";
    return NextResponse.redirect(
      new URL(
        `/${locale}/sign-in?redirectTo=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`,
        request.url
      )
    );
  }

  return response;
};
