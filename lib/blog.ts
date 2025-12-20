import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DateTime, Settings } from "luxon";

// Set Luxon default zone to UTC
Settings.defaultZone = "utc";

export interface Post {
  slug: string;
  title: string;
  date: DateTime;
  description: string;
  content: string;
  image?: string;
  authors: string[];
}

const postsDirectory = path.join(process.cwd(), "app/_posts");

function getPostsDirectoryForLocale(locale: string): string {
  return path.join(postsDirectory, locale);
}

export function getAllPostSlugs(locale: string = "en") {
  const localeDirectory = getPostsDirectoryForLocale(locale);

  if (!fs.existsSync(localeDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      return {
        slug: fileName.replace(/\.md$/, "").split("/"),
      };
    });
}

export function getPostBySlug(slugs: string[], locale: string): Post | null {
  const slug = slugs.join("/");
  const localeDirectory = getPostsDirectoryForLocale(locale);
  const fullPath = path.join(localeDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: `/blog/${slug}`,
    title: data.title || "Untitled",
    date: DateTime.fromJSDate(data.date) || DateTime.now(),
    description: data.description || "",
    content,
    image: data.image || undefined,
    authors: data.authors || [],
  };
}

export function getAllPosts(locale: string): Post[] {
  const slugs = getAllPostSlugs(locale);
  const posts = slugs
    .map((slug) => getPostBySlug(slug.slug, locale))
    .filter((post): post is Post => post !== null)
    // Sort posts by date in descending order
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  return posts;
}
