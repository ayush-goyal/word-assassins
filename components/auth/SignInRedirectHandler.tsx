"use client";

import { redirect, routing } from "@/i18n/routing";
import { usePathname } from "next/navigation";

export function SignInRedirectHandler({
  locale,
}: {
  locale: (typeof routing.locales)[number];
}) {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return redirect({ href: "/sign-in", locale });
  }

  return redirect({
    href: `/sign-in?redirectTo=${encodeURIComponent(pathname)}`,
    locale,
  });
}
