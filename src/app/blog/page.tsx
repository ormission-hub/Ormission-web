import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/data/blog";

export const metadata = {
  title: "ব্লগ ও স্টাডি গাইডলাইন | Ormission",
  description: "এইচএসসি, ভর্তি পরীক্ষা ও অ্যাকাডেমিক প্রস্তুতির জন্য সময়োপযোগী পরামর্শ ও দিকনির্দেশনামূলক প্রবন্ধ।",
};

export default function BlogPage() {
  const featuredPost = BLOG_POSTS[0];
  const regularPosts = BLOG_POSTS.slice(1);

  return (
    <div className="bg-background min-h-screen py-10 lg:py-14">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold font-bengali mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ব্লগ ও আর্টিকেকেল</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text font-bengali tracking-tight mb-3">
            অ্যাকাডেমিক পরামর্শ ও প্রস্তুতি গাইডলাইন
          </h1>
          <p className="text-text-muted text-base font-bengali">
            পরীক্ষার ভয় দূর করতে এবং সঠিক কৌশল অবলম্বন করতে অভিজ্ঞ শিক্ষকদের বিশ্লেষণধর্মী লেখা।
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-14">
            <div className="bg-surface rounded-lg border border-border overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 hover:border-primary/40 hover:shadow-md transition-all">
              <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[280px]">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.titleBn}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-semibold font-bengali">
                      {featuredPost.categoryBn}
                    </span>
                    <span className="text-text-muted flex items-center gap-1 font-bengali">
                      <Clock className="w-3 h-3" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-xl lg:text-2xl font-bold text-text font-bengali mb-3 hover:text-primary transition-colors leading-snug">
                      {featuredPost.titleBn}
                    </h2>
                  </Link>

                  <p className="text-sm text-text-muted font-bengali leading-relaxed mb-6">
                    {featuredPost.excerptBn}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                      <Image
                        src={featuredPost.authorAvatar}
                        alt={featuredPost.authorName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-text font-bengali">
                        {featuredPost.authorName}
                      </div>
                      <div className="text-text-muted font-sans text-[11px]">
                        {featuredPost.publishedAt}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="btn btn-primary btn-sm font-bengali text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <div
              key={post.id}
              className="bg-surface rounded-lg border border-border overflow-hidden flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div>
                <Link href={`/blog/${post.slug}`} className="relative aspect-video block overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.titleBn}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/70 text-white text-xs font-semibold backdrop-blur-xs font-bengali">
                    {post.categoryBn}
                  </span>
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-text-muted mb-2.5">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-base lg:text-lg text-text font-bengali mb-2 hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.titleBn}
                    </h3>
                  </Link>

                  <p className="text-xs lg:text-sm text-text-muted font-bengali leading-relaxed line-clamp-3 mb-4">
                    {post.excerptBn}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text font-bengali font-medium">
                  {post.authorName}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs text-primary font-bold font-bengali hover:underline flex items-center gap-1"
                >
                  <span>সম্পূর্ণ পড়ুন</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
