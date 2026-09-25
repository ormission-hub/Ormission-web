import { Course, CurriculumSection } from "../data/courses";
import {
  inferSectionTypeFromTitle,
  parseSectionTypeFromTitles,
} from "../section-types";
import { Instructor, INSTRUCTORS } from "../data/instructors";

export const DEFAULT_COURSE_THUMBNAIL =
  "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp";

/**
 * Ensures the hero subtitle is a clean, concise paragraph (never a giant wall of points/text).
 */
export function extractHeroSubtitle(raw?: string | null): string {
  if (!raw || typeof raw !== "string" || !raw.trim()) {
    return "দেশসেরা মেন্টরদের তত্ত্বাবধানে সর্বোচ্চ মানের প্রস্তুতি ও কনসেপ্ট ক্লিয়ারিং";
  }
  const trimmed = raw.trim();

  // If already concise and doesn't contain feature markers, return directly
  const markers = ["কোর্সে যা থাকছে", "কী কী থাকছে", "কোর্সের বৈশিষ্ট্য", "লক্ষ্য:", "উদ্দেশ্য:"];
  const hasMarker = markers.some((m) => trimmed.includes(m));
  const hasBullet = /[•\-\*\n]/.test(trimmed);

  if (!hasMarker && !hasBullet && trimmed.length <= 220) {
    return trimmed;
  }

  // If there's a marker like "কোর্সে যা থাকছে", extract everything before it
  for (const m of markers) {
    const idx = trimmed.indexOf(m);
    if (idx > 20) {
      const intro = trimmed.slice(0, idx).trim().replace(/[:—\-\.]+$/, "").trim();
      if (intro.length >= 20) return intro.endsWith("।") || intro.endsWith(".") ? intro : intro + "।";
    }
  }

  // If there are line breaks, take the first non-empty line
  const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/^[•\-\*\s]+/, "");
    if (firstLine.length >= 20 && firstLine.length <= 250) {
      return firstLine.endsWith("।") || firstLine.endsWith(".") ? firstLine : firstLine + "।";
    }
  }

  // Take the first complete sentence ending in । or .
  const sentences = trimmed.split(/(?<=[।\.!?])/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length > 0) {
    let combined = "";
    for (const s of sentences) {
      if ((combined + " " + s).trim().length <= 220) {
        combined = (combined + " " + s).trim();
      } else {
        break;
      }
    }
    if (combined.length >= 25) return combined;
    return sentences[0];
  }

  return trimmed.slice(0, 180) + "...";
}

export function mapDbCourseToAppCourse(dbCourse: any): Course {
  const cat = Array.isArray(dbCourse.categories)
    ? dbCourse.categories[0]
    : dbCourse.categories;
  const inst = Array.isArray(dbCourse.instructors)
    ? dbCourse.instructors[0]
    : dbCourse.instructors;

  const titleBn = dbCourse.title_bn || dbCourse.title || "কোর্স";
  const titleEn = dbCourse.title || dbCourse.title_bn || "Course";
  const subtitleBn = extractHeroSubtitle(dbCourse.short_description);
  const subtitleEn = extractHeroSubtitle(
    dbCourse.short_description || "High quality online preparation course"
  );

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

        const parsed = parseSectionTypeFromTitles(sec.title, sec.title_bn, sec.section_type);
        let detectedType = parsed.sectionType;
        let cleanTitle = parsed.cleanTitle || `Chapter ${sIdx + 1}`;
        let cleanTitleBn = parsed.cleanTitleBn || parsed.cleanTitle || `অধ্যায় ${sIdx + 1}`;
        const tabLabel = parsed.tabLabel;

        if (!parsed.hasTag && !sec.section_type) {
          const hasFree = sortedLessons.some((l: any) => l.is_preview === true || l.isFreePreview === true);
          detectedType = inferSectionTypeFromTitle(cleanTitle, cleanTitleBn, hasFree);
        }

        return {
          id: String(sec.id || `sec-${sIdx + 1}`),
          title: cleanTitle,
          titleBn: cleanTitleBn,
          sectionType: detectedType,
          tabLabel,
          subject: parsed.subject,
          lessons: sortedLessons.map((les: any, lIdx: number) => {
            let itemType: any = "video";
            let parsedMeta: any = {};
            if (les.content && typeof les.content === "string") {
              try {
                parsedMeta = JSON.parse(les.content);
                if (parsedMeta && parsedMeta.itemType) {
                  itemType = parsedMeta.itemType;
                }
              } catch {
                // not JSON
              }
            }
            if (!parsedMeta.itemType && les.type && ["video", "exam", "material", "live", "resource"].includes(les.type)) {
              itemType = les.type;
            }

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

            const rawResources = Array.isArray(les.lesson_resources)
              ? les.lesson_resources
              : (Array.isArray(les.materials) ? les.materials : []);

            const mappedMaterials = rawResources
              .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((res: any) => {
                let formattedSize: string | null = null;
                const rawSize = res.file_size ?? res.fileSize;
                if (typeof rawSize === "number" && rawSize > 0) {
                  const k = 1024;
                  const sizes = ["B", "KB", "MB", "GB"];
                  const i = Math.floor(Math.log(rawSize) / Math.log(k));
                  formattedSize = `${parseFloat((rawSize / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
                } else if (typeof rawSize === "string" && rawSize.trim() !== "") {
                  formattedSize = rawSize;
                }

                const isFreeMat = Boolean(
                  res.isFree ||
                  res.is_free ||
                  (typeof res.title === "string" && res.title.includes("[FREE]"))
                );
                const rawTitle = res.title || "Study Material";
                const cleanTitle = typeof rawTitle === "string" ? rawTitle.replace(/\[FREE\]/gi, "").trim() : "Study Material";

                return {
                  id: String(res.id),
                  title: cleanTitle || "Study Material",
                  fileUrl: res.file_url || res.fileUrl || "",
                  fileType: res.file_type || res.fileType || "pdf",
                  fileSize: formattedSize,
                  sortOrder: res.sort_order || 0,
                  isFree: isFreeMat,
                };
              });

            const defaultTitleBn =
              itemType === "exam"
                ? `পরীক্ষা ${lIdx + 1}`
                : itemType === "material"
                ? `লেকচার শিট ${lIdx + 1}`
                : itemType === "live"
                ? `লাইভ ক্লাস ${lIdx + 1}`
                : itemType === "resource"
                ? `রিসোর্স ${lIdx + 1}`
                : `ক্লাস ${lIdx + 1}`;

            return {
              id: String(les.id || `les-${sIdx + 1}-${lIdx + 1}`),
              title: les.title || les.title_bn || `Class ${lIdx + 1}`,
              titleBn: les.title_bn || les.title || defaultTitleBn,
              itemType,
              duration: les.video_duration
                ? `${les.video_duration}:00`
                : les.duration || (itemType === "exam" ? "25:00" : "30:00"),
              isFreePreview: isFree,
              resourcesCount: mappedMaterials.length,
              materials: mappedMaterials,
              // Rich Item Metadata
              examUrl: parsedMeta.examUrl || (itemType === "exam" ? primaryUrl : undefined),
              marks: parsedMeta.marks,
              questionsCount: parsedMeta.questionsCount,
              liveUrl: parsedMeta.liveUrl || (itemType === "live" ? primaryUrl : undefined),
              liveTime: parsedMeta.liveTime,
              livePlatform: parsedMeta.livePlatform || "zoom",
              fileUrl: parsedMeta.fileUrl || (itemType === "material" ? primaryUrl : undefined),
              fileSize: parsedMeta.fileSize,
              externalUrl: parsedMeta.externalUrl || (itemType === "resource" ? primaryUrl : undefined),
              // SECURITY: Only expose videoUrl and full server URLs for free preview lessons
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

    const rawInstructorIds = Array.isArray(courseFeatures.instructor_ids) && courseFeatures.instructor_ids.length > 0
      ? courseFeatures.instructor_ids
      : (Array.isArray(dbCourse.instructor_ids) && dbCourse.instructor_ids.length > 0 ? dbCourse.instructor_ids : null);

    const instructorIds: string[] = rawInstructorIds && rawInstructorIds.length > 0
      ? rawInstructorIds.map(String)
      : (dbCourse.instructor_id ? [String(dbCourse.instructor_id)] : (inst?.id ? [String(inst.id)] : ["inst-1"]));

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
      instructorId: String(dbCourse.instructor_id || inst?.id || instructorIds[0] || "inst-1"),
      instructorIds: instructorIds,
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
    enrolledCount: Number(dbCourse.enrollment_count) || 0,
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
    prerequisites: (
      Array.isArray(courseFeatures.prerequisites) && courseFeatures.prerequisites.length > 0
        ? courseFeatures.prerequisites.filter((p: any) => typeof p === "string" && p.trim().length > 0)
        : [
            "এসএসসি বা এইচএসসি পর্যায়ের বেসিক পাঠ্যপুস্তক ধারণা",
            "নিয়মিত ক্লাস ও প্র্যাকটিস শিট অনুশীলনের মানসিকতা",
            "ইন্টারনেট কানেকশন ও স্মার্টফোন বা কম্পিউটার",
          ]
    ),
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
