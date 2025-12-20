import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wordassassins.app";

/**
 * Generates sitemap entries for a set of pages for all locales
 */
const generateSitemapEntries = (
  pages: Array<{
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly";
    lastModified: Date;
  }>
): MetadataRoute.Sitemap => {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    const localeUrls: Record<string, string> = {};

    for (const locale of routing.locales) {
      const localePath =
        locale === routing.defaultLocale ? page.path : `/${locale}${page.path}`;
      localeUrls[locale] = `${baseUrl}${localePath}`;
    }

    // Add entries for all locales
    for (const locale of routing.locales) {
      entries.push({
        url: localeUrls[locale],
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            ...localeUrls,
            "x-default": localeUrls[routing.defaultLocale],
          },
        },
      });
    }
  }

  return entries;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      path: "/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      path: `/sign-in`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      path: `/sign-up`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      path: `/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ] as const;

  const blogPages: Array<{
    path: string;
    priority: number;
    changeFrequency: "weekly";
    lastModified: Date;
  }> = [];

  for (const locale of routing.locales) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      blogPages.push({
        path: post.slug,
        priority: 0.8,
        changeFrequency: "weekly" as const,
        lastModified: post.date.toJSDate(),
      });
    }
  }

  return generateSitemapEntries([...staticPages, ...blogPages]);
}
