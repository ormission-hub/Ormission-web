import { redirect, notFound } from "next/navigation";
import { getLiveCourseBySlug } from "@/lib/supabase/course-fetcher";

export const dynamic = "force-dynamic";

interface LearnRootProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseLearnRootPage({ params }: LearnRootProps) {
  const { slug } = await params;
  const { course } = await getLiveCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const allLessons = course.curriculum
    ? course.curriculum.flatMap((s) => s.lessons || [])
    : [];

  if (allLessons.length > 0 && allLessons[0].id) {
    redirect(`/course/${slug}/learn/${allLessons[0].id}`);
  }

  // If no lessons uploaded yet, send back to course details
  redirect(`/course/${slug}`);
}
