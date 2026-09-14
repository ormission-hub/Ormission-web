export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  excerpt: string;
  excerptBn: string;
  category: string;
  categoryBn: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  coverImage: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "admission-14-hour-study-routine",
    title: "14-Hour Effective Study Routine for University Admission 2026",
    titleBn: "এডমিশনের জন্য ১৪ ঘণ্টা পড়ার রুটিন ও ঘুমে নিয়ন্ত্রণ আনার পরীক্ষিত উপায়",
    excerpt: "A realistic 14-hour study plan for university admission without expensive coaching, including sleep control techniques.",
    excerptBn: "কোচিং ছাড়া ঘরে বসেই পূর্ণাঙ্গ এডমিশন সিলেবাস শেষ করার বৈজ্ঞানিক ১৪ ঘণ্টার স্টাডি রুটিন এবং পড়ার সময় ঘুম দূর করার পরীক্ষিত কৌশল।",
    category: "Admission Strategy",
    categoryBn: "এডমিশন রুটিন",
    authorName: "ওহিদ রাশেদ",
    authorRole: "লিড মেন্টর ও আইন বিভাগ, চট্টগ্রাম বিশ্ববিদ্যালয় (CU)",
    authorAvatar: "/images/brand-logo-v2.png",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    readTime: "৭ মিনিট পাঠ",
    publishedAt: "১২ সেপ্টেম্বর, ২০২৬",
    tags: ["Admission2026", "StudyRoutine", "SelfStudy", "SleepManagement"],
    content: `
## ১. কেন ১৪ ঘণ্টার রুটিন দরকার?
বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় প্রতিযোগিতা লাখ লাখ শিক্ষার্থীর সাথে। ঢাকার নামী কোচিংয়ে লাখ টাকা খরচ না করেও ঘরে বসে সঠিক সময় ব্যবস্থাপনায় সফল হওয়া সম্ভব।

### বৈজ্ঞানিক সময় বিভাজন (১৪ ঘণ্টা):
- **সকাল (৬:০০ - ৯:০০):** সবচেয়ে কঠিন বিষয় (ইংরেজি গ্রামার ও মুখস্থ অংশ)।
- **সকাল (১০:০০ - ১:০০):** প্রশ্নব্যাংক সলভিং ও বিগত ২০ বছরের রিপিটেড প্রশ্ন চিহ্নিতকরণ।
- **বিকাল (৩:০০ - ৬:০০):** সাধারণ জ্ঞান (GK) ও সাম্প্রতিক বিষয়াবলী নোট করা।
- **রাত (৭:০০ - ১১:০০):** রিভিশন, সেলফ-টেস্ট এবং দিনের পড়ার ডাউট ক্লিয়ারিং।

## ২. পড়ার সময় ঘুম দূর করার ৩টি সোনালী নিয়ম
১. বিছানায় শুয়ে পড়া সম্পূর্ণ বাদ দিয়ে টেবিল-চেয়ারে আলো বাতাসপূর্ণ স্থানে বসুন।
২. প্রতি ৫০ মিনিট পড়ার পর ১০ মিনিট হেঁটে হেঁটে পানি পান করুন (Pomodoro Technique)।
৩. রাতে একটানা অন্তত ৬ ঘণ্টা গভীর ঘুম নিশ্চিত করুন, যাতে দিনের বেলা শরীর ক্লান্তি অনুভব না করে।
    `,
  },
  {
    id: "blog-2",
    slug: "cu-admission-a-to-z-roadmap",
    title: "Chittagong University (CU) Admission: Complete A-to-Z Roadmap",
    titleBn: "চট্টগ্রাম বিশ্ববিদ্যালয় (CU) ভর্তি পরীক্ষা: চান্স পাওয়ার পূর্ণাঙ্গ মাস্টারপ্ল্যান",
    excerpt: "Complete guideline for CU B-Unit, D-Unit and Law Department admission, past 20 years question analysis and 15 marks English strategy.",
    excerptBn: "CU 'B', 'D' ও আইন বিভাগে চান্স পেতে কীভাবে বিগত ২০ বছরের প্রশ্নব্যাংক সলভ করবেন এবং ইংরেজিতে নিশ্চিত ১৫ মার্ক তুলবেন তার A to Z গাইডলাইন।",
    category: "CU Admission Guide",
    categoryBn: "CU এডমিশন গাইড",
    authorName: "ওহিদ রাশেদ",
    authorRole: "আইন বিভাগ, চট্টগ্রাম বিশ্ববিদ্যালয় (CU)",
    authorAvatar: "/images/brand-logo-v2.png",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    readTime: "৮ মিনিট পাঠ",
    publishedAt: "১০ সেপ্টেম্বর, ২০২৬",
    tags: ["CUAdmission", "ChittagongUniversity", "CULaw", "AdmissionGuideline"],
    content: `
## ১. চট্টগ্রাম বিশ্ববিদ্যালয়ের প্রশ্নের বিশেষত্ব
চবি ভর্তি পরীক্ষায় বিগত বছরের প্রশ্ন পুনরাবৃত্তি হওয়ার হার তুলনামূলকভাবে বেশি। বিশেষ করে ইংরেজি ও সাধারণ জ্ঞানে প্রশ্নব্যাংকের গভীর ধারণা থাকলে ৫০% প্রশ্নের উত্তর সরাসরি নির্ণয় করা যায়।

### চবি ইংরেজি: ১৫ মার্ক নিশ্চিত করার কৌশল
- সাবজেক্ট-ভার্ব এগ্রিমেন্ট, রাইট ফর্ম অব ভার্বস ও কন্ডিশনাল সেন্টেন্স থেকে প্রতি বছর ৩-৪টি প্রশ্ন আসে।
- প্রেপোজিশন ও গ্রুপ ভার্বস মুখস্থের বদলে বিগত ২০ বছরের প্রশ্নে আসা শব্দগুলো বারবার রিভিশন দিন।
- সিনোনিম ও অ্যান্টনিম অপশন এলিমিনেশন টেকনিকে সমাধান করুন।

## ২. নেগেটিভ মার্কিং এড়িয়ে চলার উপায়
চবি পরীক্ষায় প্রতিটি ভুল উত্তরের জন্য ০.২৫ মার্ক কাটা যায়। যেসব প্রশ্নে ৫০-৫০ কনফিউশন থাকে, কেবল সেখানেই সতর্কতার সাথে দাগান। সম্পূর্ণ আন্দাজে দাগানো থেকে বিরত থাকুন।
    `,
  },
  {
    id: "blog-3",
    slug: "memory-retention-study-hacks",
    title: "How to Overcome Forgetfulness: 5 Scientific Memory Retention Hacks",
    titleBn: "পড়া ভুলে যাওয়ার ভয় দূর করবেন কীভাবে? পড়া মনে রাখার ৫টি বৈজ্ঞানিক কৌশল",
    excerpt: "Active recall, spaced repetition, and study retention strategies to overcome low GPA and ace admission exams.",
    excerptBn: "পড়া একবার পড়েই দীর্ঘমেয়াদে মনে রাখার অ্যাক্টিভ রিকল ও স্পেসড রিপিটেশন টেকনিক এবং কম জিপিএ নিয়ে সফল হওয়ার বাস্তব উপায়।",
    category: "Study Hacks",
    categoryBn: "স্টাডি হ্যাক্স",
    authorName: "ওহিদ রাশেদ ও মেন্টর প্যানেল",
    authorRole: "সিনিয়র মেন্টর, Ormission",
    authorAvatar: "/images/brand-logo-v2.png",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    readTime: "৬ মিনিট পাঠ",
    publishedAt: "০৫ সেপ্টেম্বর, ২০২৬",
    tags: ["MemoryHacks", "ActiveRecall", "LowGPAStrategy", "StudyTips"],
    content: `
## ১. এক্টিভ রিকল (Active Recall)
বই খুলে বারবার রিডিং পড়া সবচেয়ে অকার্যকর উপায়। একটি অধ্যায় পড়ার পর বই বন্ধ করে সাদা খাতায় চোখ বন্ধ করে মূল সূত্র, পয়েন্ট বা ঘটনাগুলো লিখুন। মস্তিষ্ক যখন জোর করে মেমোরি থেকে তথ্য টানে, তখনই স্মৃতি নিউরনে স্থায়ী রূপ নেয়।

## ২. স্পেসড রিপিটেশন (Spaced Repetition)
পড়ার ১ম দিন পর ৩য় দিন, তারপর ৭ম দিন এবং ২১তম দিনে রিভিশন দিন। এতে বিস্মরণ বক্ররেখা (Forgetting Curve) নিষ্ক্রিয় হয়ে যায়।

## ৩. কম জিপিএ নিয়েও বিশ্ববিদ্যালয় চান্স পাওয়ার কৌশল
এসএসসি বা এইচএসসিতে জিপিএ কম থাকলে মানসিকভাবে ভেঙে পড়বেন না। চট্টগ্রাম বিশ্ববিদ্যালয় (CU), গুচ্ছ (GST) এবং রাজশাহী বিশ্ববিদ্যালয় (RU)-তে লিখিত ও এমসিকিউতে ভালো নম্বর তুলে কম জিপিএ-র ব্যবধান সহজেই পুষিয়ে নেওয়া যায়।
    `,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((b) => b.slug === slug);
}
