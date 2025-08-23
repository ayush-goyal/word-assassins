import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  return await updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - manifest.json
     * - robots.txt
     * - sitemap.xml
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.*|android-chrome.*|apple-touch-icon.*|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
