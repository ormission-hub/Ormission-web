import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchAllBooks } from "@/lib/data/books";
import { BooksClient } from "@/components/books/books-client";

export const metadata: Metadata = {
  title: "সকল বই ও স্টাডি বুকলেট — স্পেশাল প্রকাশনা | Ormission",
  description:
    "এইচএসসি, এসএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার সেরা ফর্মুলা বুক ও প্রশ্নব্যাংক সংগ্রহ করুন সরাসরি ঘরে বসেই।",
};

// ISR: Cache book directory for 5 minutes
export const revalidate = 300;

export default async function BooksPage() {
  const books = await fetchAllBooks();

  return (
    <Suspense
      fallback={
        <div className="container-main py-24 text-center text-text-muted font-bengali">
          বইয়ের তালিকা লোড হচ্ছে...
        </div>
      }
    >
      <BooksClient initialBooks={books} />
    </Suspense>
  );
}
