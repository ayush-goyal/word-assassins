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

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      slug: fileName.replace(/\.md$/, "").split("/"),
    };
  });
}

export function getPostBySlug(slugs: string[]): Post | null {
  const slug = slugs.join("/");
  const fullPath = path.join(postsDirectory, `${slug}.md`);

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

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug.slug))
    .filter((post): post is Post => post !== null)
    // Sort posts by date in descending order
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  return posts;
}
