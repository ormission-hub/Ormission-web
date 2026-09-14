import Link from "next/link";
import { FileText, Download, ArrowRight, Sparkles } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { SectionHeading } from "@/components/global/section-heading";
import { cn } from "@/lib/utils";

const resources = [
  {
    title: "বিশ্ববিদ্যালয় ভর্তি English: ১৫ মার্ক নিশ্চিত করার স্পেশাল রুলস শিট",
    subject: "এডমিশন ইংলিশ",
    fileType: "PDF",
    size: "২.৮ MB",
    downloads: "৬,৩২০+ ডাউনলোড",
  },
  {
    title: "CU, DU ও গুচ্ছ এডমিশন প্রশ্নব্যাংক বিশ্লেষণ ও শর্টকাট বুকলেট",
    subject: "প্রশ্নব্যাংক সমাধান",
    fileType: "PDF",
    size: "৪.৫ MB",
    downloads: "৫,৪০০+ ডাউনলোড",
  },
  {
    title: "এইচএসসি সমাজবিজ্ঞান ও সমাজকর্ম Top 300+ MCQ স্পেশাল শিট",
    subject: "এইচএসসি মানবিক",
    fileType: "PDF",
    size: "৩.১ MB",
    downloads: "৩,৯৮০+ ডাউনলোড",
  },
  {
    title: "এডমিশন সাধারণ জ্ঞান (GK) ১০০% গুরুত্বপূর্ণ টপিক ও সাজেশন ২০২৬",
    subject: "সাধারণ জ্ঞান",
    fileType: "PDF",
    size: "২.৬ MB",
    downloads: "৪,৭৫০+ ডাউনলোড",
  },
];

export function FreeResourcesPreview() {
  return (
    <SectionWrapper className="bg-surface-secondary/50">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 lg:mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold mb-3 font-bengali">
            <Sparkles className="w-3.5 h-3.5" />
            <span>১০০% ফ্রি স্টাডি মেটেরিয়াল</span>
          </div>
          <SectionHeading
            title="Ormission এক্সক্লুসিভ ফ্রি স্টাডি রিসোর্স"
            subtitle="বোর্ড পরীক্ষা ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় সেরা প্রস্তুতির জন্য ফ্রি লেকচার শিট, হ্যান্ডনোট ও প্রশ্নব্যাংক ডাউনলোড করুন"
            centered={false}
            className="mb-0"
          />
        </div>

        <Link
          href="/free-resources"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors font-bengali shrink-0"
        >
          <span>সব রিসোর্স দেখুন ({">"}৫০টি)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((resource, i) => (
          <div
            key={i}
            className={cn(
              "group flex items-center justify-between gap-4 p-5 rounded-2xl transition-all duration-300",
              "bg-surface border border-border/80 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
            )}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-error/10 text-error border border-error/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-text font-bengali truncate group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-text-muted font-bengali mt-0.5">
                  {resource.subject} · {resource.fileType} ({resource.size}) · <span className="text-secondary font-medium">{resource.downloads}</span>
                </p>
              </div>
            </div>

            <Link
              href="/free-resources"
              className="p-2.5 rounded-xl bg-surface-secondary text-text-muted hover:text-white hover:bg-primary transition-all shrink-0 border border-border hover:border-primary"
              aria-label={`Download ${resource.title}`}
            >
              <Download className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
