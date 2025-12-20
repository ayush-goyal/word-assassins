import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { SignInRedirectHandler } from "@/components/auth/SignInRedirectHandler";
import { routing } from "@/i18n/routing";

export default async function GamesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const supabase = await createClient();
  const { locale } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SignInRedirectHandler locale={locale} />;
  }

  return <Suspense>{children}</Suspense>;
}
