import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest news, updates, and stories from our team",
};

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl font-semibold tracking-tight lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Our latest news, updates, and stories.
          </p>
        </div>
      </div>

      <hr className="my-8" />

      {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative flex flex-col space-y-2"
            >
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={804}
                  height={452}
                  className="rounded-md border bg-muted transition-colors object-cover aspect-[16/9] w-full"
                  priority
                />
              )}
              <h2 className="text-2xl font-extrabold">{post.title}</h2>
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  {post.date.toFormat("LLLL d, yyyy")}
                </p>
              )}
              <Link href={post.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>Posts coming soon!</p>
      )}
    </div>
  );
}
