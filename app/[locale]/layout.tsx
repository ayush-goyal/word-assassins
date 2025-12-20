import HeaderAuth from "@/components/header";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import Providers from "./providers";
import { Footer } from "@/components/footer";
import { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import { GoogleAnalytics } from "@next/third-parties/google";
import { notFound } from "next/navigation";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    title: {
      default: t("title"),
      template: "%s | Word Assassins",
    },
    description: t("description"),
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        {
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    keywords: [
      "word game",
      "social deduction",
      "party game",
      "online game",
      "multiplayer",
    ],
    creator: "Word Assassins",
    publisher: "Word Assassins",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: process.env.NEXT_PUBLIC_SITE_URL,
      title: t("title"),
      description: t("description"),
      siteName: "Word Assassins",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const tLayout = await getTranslations("layout");

  // JSON-LD for SEO (https://developers.google.com/search/docs/appearance/site-names)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Word Assassins",
    url: process.env.NEXT_PUBLIC_SITE_URL,
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen overflow-x-hidden">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4"
              >
                {tLayout("skipToMainContent")}
              </a>
              <div className="min-h-screen flex flex-col">
                <HeaderAuth />
                <main
                  id="main-content"
                  className="flex-1 flex flex-col items-center"
                  role="main"
                >
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-W0EW2S50XE" />
    </html>
  );
}
