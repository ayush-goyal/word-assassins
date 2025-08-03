import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import {
  ChevronLeft,
  Target,
  Users,
  Shield,
  MessageSquare,
  Swords,
  ArrowRight,
} from "lucide-react";
import Markdown from "react-markdown";

interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    authors: post.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatAuthors(authors: string[]): string {
  if (!authors || authors.length === 0) return "";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;

  const lastAuthor = authors[authors.length - 1];
  const otherAuthors = authors.slice(0, -1).join(", ");
  return `${otherAuthors}, and ${lastAuthor}`;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container max-w-4xl py-6 lg:py-10">
      <div className="mb-8 flex items-center">
        <Link
          href="/blog"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "inline-flex items-center"
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
      <div>
        {post.date && (
          <time
            dateTime={post.date.toFormat("yyyy-MM-dd")}
            className="block text-sm text-muted-foreground"
          >
            {post.date.toFormat("LLLL d, yyyy")}
          </time>
        )}
        <h1 className="mt-2 inline-block font-heading text-4xl font-semibold leading-tight lg:text-5xl">
          {post.title}
        </h1>
        {post.authors?.length ? (
          <div className="mt-4 flex items-center text-sm">
            <p className="font-medium">By {formatAuthors(post.authors)}</p>
          </div>
        ) : null}
      </div>
      {post.image && (
        <div className="w-full">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={675}
            className="my-8 rounded-md border bg-muted transition-colors w-full h-auto"
            priority
          />
        </div>
      )}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <Markdown>{post.content}</Markdown>
      </div>
      <hr className="mt-12" />

      {/* CTA */}
      <div className="my-10 rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Target className="h-8 w-8 text-primary transform rotate-6" />
            <Users className="h-8 w-8 text-muted-foreground transform -rotate-3" />
            <Shield className="h-8 w-8 text-primary transform rotate-6" />
            <MessageSquare className="h-8 w-8 text-muted-foreground transform -rotate-6" />
            <Swords className="h-8 w-8 text-primary transform" />
          </div>
          <h3 className="text-2xl font-bold">Ready to play Word Assassins?</h3>
          <p className="text-muted-foreground max-w-[42rem]">
            The ultimate social deduction game that combines stealth, strategy,
            and vocabulary. Eliminate your targets, stay alive, and become the
            last assassin standing.
          </p>
          <Button size="lg" asChild>
            <Link href="/sign-up" className="gap-2">
              Start Playing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex justify-start">
        <Link
          href="/blog"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "inline-flex items-center"
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  );
}
