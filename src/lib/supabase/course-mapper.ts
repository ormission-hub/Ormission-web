import { Course, CurriculumSection } from "../data/courses";
import { Instructor, INSTRUCTORS } from "../data/instructors";

export const DEFAULT_COURSE_THUMBNAIL =
  "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp";

export function mapDbCourseToAppCourse(dbCourse: any): Course {
  const cat = Array.isArray(dbCourse.categories)
    ? dbCourse.categories[0]
    : dbCourse.categories;
  const inst = Array.isArray(dbCourse.instructors)
    ? dbCourse.instructors[0]
    : dbCourse.instructors;

  const titleBn = dbCourse.title_bn || dbCourse.title || "কোর্স";
  const titleEn = dbCourse.title || dbCourse.title_bn || "Course";
  const subtitleBn =
    dbCourse.short_description ||
    "দেশসেরা মেন্টরদের তত্ত্বাবধানে সর্বোচ্চ মানের প্রস্তুতি ও কনসেপ্ট ক্লিয়ারিং";
  const subtitleEn = dbCourse.short_description || "High quality online preparation course";

  const thumbnail =
    dbCourse.thumbnail_url && dbCourse.thumbnail_url.trim() !== ""
      ? dbCourse.thumbnail_url
      : DEFAULT_COURSE_THUMBNAIL;

  const defaultCurriculum: CurriculumSection[] = [
    {
      id: `sec-${dbCourse.id || 1}`,
      title: "অধ্যায় ১: মৌলিক ধারণা ও ভিত্তি তৈরি",
      titleBn: "অধ্যায় ১: মৌলিক ধারণা ও ভিত্তি তৈরি",
      lessons: [
        {
          id: `les-1`,
          title: "Course Orientation & Guideline",
          titleBn: "কোর্স ওরিয়েন্টেশন ও প্রস্তুতি কৌশল",
          duration: "20:00",
          isFreePreview: true,
          videoUrl: dbCourse.preview_video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
        {
          id: `les-2`,
          title: "Core Concepts & Fundamentals",
          titleBn: "মৌলিক অধ্যায় ও কনসেপ্ট বিশ্লেষণ",
          duration: "45:00",
          isFreePreview: false,
        },
        {
          id: `les-3`,
          title: "Previous Years Question Solutions",
          titleBn: "বিগত বছরের প্রশ্ন সমাধান ও শর্টকাট টেকনিক",
          duration: "50:00",
          isFreePreview: false,
        },
      ],
    },
  ];

  return {
    id: String(dbCourse.id),
    slug: dbCourse.slug,
    title: titleEn,
    titleBn: titleBn,
    subtitle: subtitleEn,
    subtitleBn: subtitleBn,
    categoryId: String(dbCourse.category_id || cat?.id || "general"),
    categorySlug: cat?.slug || "general",
    categoryNameBn: cat?.name_bn || cat?.name || "অনলাইন কোর্স",
    subcategorySlug: cat?.slug || "general",
    subcategoryNameBn: cat?.name_bn || cat?.name || "সাধারণ",
    instructorId: String(dbCourse.instructor_id || inst?.id || "inst-1"),
    price: Number(dbCourse.price) || 0,
    originalPrice:
      Number(dbCourse.original_price) && Number(dbCourse.original_price) > Number(dbCourse.price)
        ? Number(dbCourse.original_price)
        : Number(dbCourse.price) > 0
        ? Math.round(Number(dbCourse.price) * 1.4)
        : 0,
    rating: 4.9,
    reviewsCount: 128,
    enrolledCount: Number(dbCourse.enrollment_count) || 1250,
    durationHours: Math.max(1, Math.round((Number(dbCourse.total_duration) || 2400) / 60)),
    totalLessons: Number(dbCourse.total_lessons) || 35,
    level: "Intermediate",
    language: "বাংলা",
    thumbnail: thumbnail,
    previewVideoUrl: dbCourse.preview_video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isFeatured: !!dbCourse.is_featured,
    isPopular: !!dbCourse.is_featured,
    badge: dbCourse.is_featured ? "জনপ্রিয় কোর্স" : undefined,
    badgeColor: "primary",
    description: dbCourse.description || dbCourse.short_description || subtitleEn,
    descriptionBn: dbCourse.description || dbCourse.short_description || subtitleBn,
    highlights: [
      "লাইভ ও রেকর্ডেড ক্লাস সুবিধা ফুল এইচডি কোয়ালিটিতে",
      "অধ্যায়ভিত্তিক প্র্যাকটিস শিট ও বিগত বছরের প্রশ্ন সমাধান PDF",
      "২৪/৭ স্পেশাল মেন্টর ফোরাম ও ডাউট সলভিং সাপোর্ট",
      "পূর্ণাঙ্গ মডেল টেস্ট ও ইনস্ট্যান্ট রেজাল্ট এনালাইসিস",
    ],
    prerequisites: [
      "এসএসসি বা এইচএসসি পর্যায়ের বেসিক পাঠ্যপুস্তক ধারণা",
      "নিয়মিত ক্লাস ও প্র্যাকটিস শিট অনুশীলনের মানসিকতা",
      "ইন্টারনেট কানেকশন ও স্মার্টফোন বা কম্পিউটার",
    ],
    curriculum: defaultCurriculum,
    faqs: [
      {
        question: "ক্লাসগুলো কি রেকর্ডেড থাকবে?",
        answer: "হ্যাঁ, যেকোনো সময় আপনার সুবিধামতো ক্লাসের রেকর্ডিং যতবার ইচ্ছা দেখতে পারবেন।",
      },
      {
        question: "লেকচার শিট বা নোট কি দেওয়া হবে?",
        answer: "প্রতিটি ক্লাসের সাথে অধ্যায়ভিত্তিক স্পেশাল লেকচার শিট ও প্র্যাকটিস প্রশ্ন PDF পাবেন।",
      },
    ],
    reviews: [],
  };
}

export function mapDbInstructorToAppInstructor(inst: any): Instructor | undefined {
  if (!inst) return undefined;
  return {
    id: String(inst.id),
    name: inst.name || inst.name_bn || "ইন্সট্রাক্টর",
    nameBn: inst.name_bn || inst.name || "ইন্সট্রাক্টর",
    slug: inst.slug || `instructor-${inst.id}`,
    institution: inst.institution || "Ormission Edu",
    institutionBn: inst.institution || "Ormission Edu",
    department: inst.credentials || "শিক্ষা ও প্রশিক্ষণ",
    role: inst.designation || "সিনিয়র মেন্টর",
    avatarUrl:
      inst.photo_url ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    bio: inst.bio || "অভিজ্ঞ শিক্ষক ও মেন্টর।",
    bioBn: inst.bio || "অভিজ্ঞ শিক্ষক ও মেন্টর।",
    studentsCount: 15400,
    coursesCount: 4,
    reviewsCount: 320,
    rating: 4.95,
    featured: true,
  };
}
