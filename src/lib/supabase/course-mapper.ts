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

  // Build curriculum from real DB sections and lessons only — no fake/mock fallback
  let mappedCurriculum: CurriculumSection[] = [];
  if (Array.isArray(dbCourse.course_sections) && dbCourse.course_sections.length > 0) {
    const sortedSections = [...dbCourse.course_sections].sort(
      (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
    );

    const totalLessonsInSections = sortedSections.reduce(
      (acc: number, sec: any) => acc + (Array.isArray(sec.lessons) ? sec.lessons.length : 0),
      0
    );

    if (totalLessonsInSections > 0) {
      mappedCurriculum = sortedSections.map((sec: any, sIdx: number) => {
        const sortedLessons = Array.isArray(sec.lessons)
          ? [...sec.lessons].sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          : [];

        return {
          id: String(sec.id || `sec-${sIdx + 1}`),
          title: sec.title || sec.title_bn || `Chapter ${sIdx + 1}`,
          titleBn: sec.title_bn || sec.title || `অধ্যায় ${sIdx + 1}`,
          lessons: sortedLessons.map((les: any, lIdx: number) => {
            const isFree = les.is_preview === true || les.isFreePreview === true;
            const rawServers = Array.isArray(les.lesson_servers) ? les.lesson_servers : [];
            const mappedServers = rawServers
              .filter((srv: any) => srv.is_enabled !== false)
              .sort((a: any, b: any) => (a.sort_order || 1) - (b.sort_order || 1))
              .map((srv: any) => ({
                id: String(srv.id),
                name: (srv.server_name && srv.server_name.trim()) ? srv.server_name.trim() : `Server ${srv.sort_order || 1}`,
                type: srv.server_type || "youtube",
                url: srv.video_url || "",
              }));

            const fallbackServers = mappedServers.length > 0
              ? mappedServers
              : (les.video_url ? [{ id: `srv-${les.id}-1`, name: "Server 1", type: "youtube", url: les.video_url }] : []);

            const primaryUrl = fallbackServers.length > 0 ? fallbackServers[0].url : (les.video_url || les.videoUrl || "");

            return {
              id: String(les.id || `les-${sIdx + 1}-${lIdx + 1}`),
              title: les.title || les.title_bn || `Class ${lIdx + 1}`,
              titleBn: les.title_bn || les.title || `ক্লাস ${lIdx + 1}`,
              duration: les.video_duration
                ? `${les.video_duration}:00`
                : les.duration || "30:00",
              isFreePreview: isFree,
              // SECURITY: Only expose videoUrl and full server URLs for free preview lessons
              // Paid lesson URLs are ONLY served via /api/course/access after auth check
              videoUrl: isFree ? primaryUrl : undefined,
              servers: isFree
                ? fallbackServers
                : (fallbackServers.length > 0 ? fallbackServers.map((s: any) => ({ id: s.id, name: s.name, type: s.type, url: "" })) : undefined),
            };
          }),
        };
      });
    }
    // If sections exist but have 0 lessons, mappedCurriculum stays [] (empty)
  }

    // Extract dynamic rating settings from features JSONB or fallback
    const courseFeatures = (dbCourse.features && typeof dbCourse.features === "object") ? dbCourse.features : {};
    const showRating = courseFeatures.show_rating !== undefined
      ? Boolean(courseFeatures.show_rating)
      : (dbCourse.show_rating !== undefined ? Boolean(dbCourse.show_rating) : true);
    const ratingScore = courseFeatures.rating !== undefined
      ? Number(courseFeatures.rating)
      : (dbCourse.rating !== undefined ? Number(dbCourse.rating) : 5.0);
    const reviewsCount = courseFeatures.reviews_count !== undefined
      ? Number(courseFeatures.reviews_count)
      : (dbCourse.reviews_count !== undefined ? Number(dbCourse.reviews_count) : 125);

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
      rating: ratingScore,
      reviewsCount: reviewsCount,
      showRating: showRating,
    enrolledCount: Number(dbCourse.enrollment_count) || 1250,
    durationHours: Math.max(1, Math.round((Number(dbCourse.total_duration) || 2400) / 60)),
    totalLessons: Number(dbCourse.total_lessons) || mappedCurriculum.reduce((acc, s) => acc + s.lessons.length, 0),
    level: "Intermediate",
    language: "বাংলা",
    thumbnail: thumbnail,
    previewVideoUrl: dbCourse.preview_video_url || "",
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
    curriculum: mappedCurriculum,
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
