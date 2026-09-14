"use client";

import { useState, useMemo } from "react";
import { Search, FileDown, FileText, BookOpen, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { FREE_RESOURCES } from "@/lib/data/resources";

export default function FreeResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredResources = useMemo(() => {
    return FREE_RESOURCES.filter((res) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        res.title.toLowerCase().includes(query) ||
        res.titleBn.toLowerCase().includes(query) ||
        res.subjectBn.toLowerCase().includes(query);

      const matchesCat =
        selectedCategory === "all" || res.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-background min-h-screen py-10 lg:py-14">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold font-bengali mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>১০০% ফ্রি রিসোর্স হাব</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text font-bengali tracking-tight mb-3">
            পড়াশোনার গতি বাড়াতে ফ্রি লেকচার শিট ও ফর্মুলা বুকলেট
          </h1>
          <p className="text-text-muted text-base font-bengali">
            বোর্ড ও বিশ্ববিদ্যালয়ের বিগত বছরের প্রশ্ন বিশ্লেষণ, অধ্যায়ভিত্তিক গুরুত্বপূর্ণ হ্যান্ডনোট ও রঙিন রোডম্যাপ ডাউনলোড করুন সম্পূর্ণ বিনামূল্যে।
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-surface rounded-lg border border-border p-4 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="রিসোর্স বা বিষয়ের নাম খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 text-sm font-bengali w-full"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors font-bengali ${
                  selectedCategory === "all"
                    ? "bg-secondary text-white"
                    : "bg-surface-secondary text-text-muted hover:text-text"
                }`}
              >
                সকল রিসোর্স ({FREE_RESOURCES.length})
              </button>
              <button
                onClick={() => setSelectedCategory("HSC")}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors font-bengali ${
                  selectedCategory === "HSC"
                    ? "bg-secondary text-white"
                    : "bg-surface-secondary text-text-muted hover:text-text"
                }`}
              >
                এইচএসসি (HSC)
              </button>
              <button
                onClick={() => setSelectedCategory("Admission")}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors font-bengali ${
                  selectedCategory === "Admission"
                    ? "bg-secondary text-white"
                    : "bg-surface-secondary text-text-muted hover:text-text"
                }`}
              >
                ভর্তি প্রস্তুতি (Admission)
              </button>
              <button
                onClick={() => setSelectedCategory("SSC")}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors font-bengali ${
                  selectedCategory === "SSC"
                    ? "bg-secondary text-white"
                    : "bg-surface-secondary text-text-muted hover:text-text"
                }`}
              >
                এসএসসি (SSC)
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-surface rounded-lg border border-border p-6 flex flex-col justify-between hover:border-secondary/40 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-secondary/10 text-secondary font-semibold font-bengali">
                      {res.categoryBn} • {res.subjectBn}
                    </span>
                    <span className="text-text-muted font-sans font-medium">
                      {res.format}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-text font-bengali mb-2 leading-snug">
                    {res.titleBn}
                  </h3>
                  <p className="text-xs text-text-muted font-sans mb-3">
                    {res.title}
                  </p>
                  <p className="text-xs text-text-muted font-bengali leading-relaxed mb-6">
                    {res.descriptionBn}
                  </p>
                </div>

                <div>
                  {/* Meta footer */}
                  <div className="flex items-center justify-between text-xs text-text-muted border-t border-border pt-3 mb-4">
                    <span>{res.pages} পৃষ্ঠা • {res.fileSize}</span>
                    <span className="font-sans font-medium text-text">
                      {res.downloadsCount.toLocaleString("en-US")} downloads
                    </span>
                  </div>

                  {/* Download Action */}
                  <button
                    type="button"
                    onClick={() => {
                      alert(`'${res.titleBn}' ডাউনলোড প্রক্রিয়া শুরু হচ্ছে...`);
                    }}
                    className="btn btn-outline btn-sm w-full font-bengali font-semibold flex items-center justify-center gap-2 hover:bg-secondary hover:text-white hover:border-secondary transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>পিডিএফ ডাউনলোড করুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-lg border border-border p-12 text-center max-w-md mx-auto">
            <FileText className="w-12 h-12 text-text-muted/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text font-bengali mb-2">কোনো রিসোর্স পাওয়া যায়নি</h3>
            <p className="text-sm text-text-muted font-bengali mb-4">
              আপনার অনুসন্ধানের সাথে মেলে এমন কোনো রিসোর্স নেই।
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="btn btn-secondary btn-sm font-bengali"
            >
              সব রিসোর্স দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
