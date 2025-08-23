import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { Crosshair, LayoutDashboard, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { revalidatePath } from "next/cache";
import { Link, redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

async function signOutAction() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect({ href: "/sign-in", locale: "en" });
}

export default async function Header() {
  const supabase = await createClient();
  const t = await getTranslations('navigation');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const AuthButtons = () => (
    <div className="flex items-center gap-4">
      <Button asChild variant="ghost" size="sm">
        <Link href="/sign-in">{t('signIn')}</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">{t('signUp')}</Link>
      </Button>
    </div>
  );

  const UserMenu = () => (
    <div className="flex items-center gap-4">
      <Button asChild variant="ghost" size="sm" className="hidden md:flex">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>{t('dashboard')}</span>
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground hidden sm:block">
        {user?.email}
      </p>
      <form action={signOutAction} className="hidden md:block">
        <Button type="submit" variant="outline" size="sm">
          {t('signOut')}
        </Button>
      </form>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo section */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90">
          <Crosshair className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">Word Assassins</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {!hasEnvVars ? (
            <Button disabled variant="outline" size="sm">
              Setup required
            </Button>
          ) : user ? (
            <UserMenu />
          ) : (
            <AuthButtons />
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {!hasEnvVars ? (
                  <Button disabled variant="outline" size="sm">
                    Setup required
                  </Button>
                ) : user ? (
                  <div className="flex flex-col gap-3">
                    <div className="px-2">
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>{t('dashboard')}</span>
                        </Link>
                      </Button>
                      <form action={signOutAction}>
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          {t('signOut')}
                        </Button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full"
                    >
                      <Link href="/sign-in">{t('signIn')}</Link>
                    </Button>
                    <Button asChild size="sm" className="w-full">
                      <Link href="/sign-up">{t('signUp')}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
