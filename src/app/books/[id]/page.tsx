import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { fetchBookById, fetchAllBooks } from "@/lib/data/books";
import { BookDetailClient } from "@/components/books/book-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ISR: Cache book details for 5 minutes
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const books = await fetchAllBooks();
    return books.map((b) => ({ id: b.id }));
  } catch (err) {
    console.warn("generateStaticParams books error:", err);
    return [{ id: "book-1" }];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await fetchBookById(id);

  if (!book) {
    return {
      title: "বইটি পাওয়া যায়নি | Ormission",
    };
  }

  const title = `${book.title} — ${book.category} | Ormission`;
  const description =
    book.subtitle ||
    book.description?.slice(0, 160) ||
    `${book.title} বইটির বিস্তারিত বিবরণ এবং অনলাইন অর্ডার`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: book.cover_image ? [{ url: book.cover_image }] : [],
    },
  };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;
  const book = await fetchBookById(id);

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24 pb-16 font-bengali px-4">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-text-muted/60" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-2">বইটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-sm text-text-muted mb-6 text-center max-w-md">
          আপনি যে বইটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি সঠিক নয়।
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল বই দেখুন</span>
        </Link>
      </div>
    );
  }

  const allBooks = await fetchAllBooks();
  const relatedBooks = allBooks
    .filter((b) => b.id.toLowerCase() !== id.toLowerCase())
    .slice(0, 3);

  return <BookDetailClient book={book} relatedBooks={relatedBooks} />;
}
