import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, ArrowRight } from "lucide-react";
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/data/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "প্রবন্ধ পাওয়া যায়নি" };
  }

  return {
    title: `${post.titleBn} | Ormission ব্লগ`,
    description: post.excerptBn,
    openGraph: {
      title: post.titleBn,
      description: post.excerptBn,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="bg-background min-h-screen py-10 lg:py-14">
      <div className="container-main max-w-4xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary mb-8 transition-colors font-bengali"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল আর্টিকেলে ফিরে যান</span>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary font-bengali">
              {post.categoryBn}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1 font-bengali">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1 font-sans">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text font-bengali tracking-tight leading-snug mb-4">
            {post.titleBn}
          </h1>

          <p className="text-base text-text-muted font-bengali leading-relaxed mb-6">
            {post.excerptBn}
          </p>

          {/* Author Strip */}
          <div className="flex items-center gap-3 border-y border-border py-4">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0">
              <Image
                src={post.authorAvatar}
                alt={post.authorName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-text font-bengali">
                {post.authorName}
              </div>
              <div className="text-xs text-text-muted font-bengali">
                {post.authorRole}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-10 border border-border shadow-sm">
          <Image
            src={post.coverImage}
            alt={post.titleBn}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <article className="prose prose-slate max-w-none text-base text-text font-bengali leading-relaxed space-y-6">
          <div
            className="whitespace-pre-line leading-loose"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-text mt-8 mb-4 border-b border-border pb-2">$1</h2>')
                .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-text mt-6 mb-3">$1</h3>')
                .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-text-muted">$1</li>'),
            }}
          />
        </article>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-border">
          <span className="text-xs text-text-muted font-bengali mr-1">ট্যাগসমূহ:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded text-xs bg-surface-secondary text-text font-sans font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border">
            <h3 className="text-xl font-bold text-text font-bengali mb-6">
              আরও পড়ুন
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="bg-surface rounded-lg border border-border p-5 hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs text-primary font-bengali font-semibold block mb-2">
                      {rel.categoryBn}
                    </span>
                    <h4 className="font-bold text-sm lg:text-base text-text font-bengali line-clamp-2 mb-2">
                      {rel.titleBn}
                    </h4>
                    <p className="text-xs text-text-muted font-bengali line-clamp-2">
                      {rel.excerptBn}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-primary font-bengali font-semibold">
                    <span>পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
