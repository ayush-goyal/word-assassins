import { createClient } from "@/utils/supabase/server";
import { SignInRedirectHandler } from "@/components/auth/SignInRedirectHandler";
import { routing } from "@/i18n/routing";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const supabase = await createClient();
  const { locale } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SignInRedirectHandler locale={locale} />;
  }

  return <>{children}</>;
}
