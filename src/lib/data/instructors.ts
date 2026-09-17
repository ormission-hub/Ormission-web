export interface Instructor {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  institution: string;
  institutionBn: string;
  department: string;
  role: string;
  bio: string;
  bioBn: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  coursesCount: number;
  featured: boolean;
  socials?: {
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export const INSTRUCTORS: Instructor[] = [
  {
    id: "inst-ohid",
    name: "Md. Ohid Rashed",
    nameBn: "মোঃ ওহিদ রাশেদ",
    slug: "ohid-rashed",
    institution: "Ormission Education",
    institutionBn: "ওরমিশন এডুকেশন",
    department: "Law Department, CU",
    role: "মালিক ও পরিচালক",
    bio: "চট্টগ্রাম বিশ্ববিদ্যালয় আইন বিভাগ। ওরমিশন এডুকেশনের সম্মানিত প্রতিষ্ঠাতা ও পরিচালক।",
    bioBn: "চট্টগ্রাম বিশ্ববিদ্যালয় আইন বিভাগ। ওরমিশন এডুকেশনের সম্মানিত প্রতিষ্ঠাতা ও পরিচালক। বিগত ৫ বছর ধরে হাজারো শিক্ষার্থীকে সফলতার সাথে মেন্টরিং করছেন।",
    avatarUrl: "/images/ohid-rashed.jpg",
    rating: 5.0,
    reviewsCount: 1500,
    studentsCount: 12500,
    coursesCount: 6,
    featured: true,
  },
];

export function getInstructorBySlug(slug: string): Instructor | undefined {
  return INSTRUCTORS.find((inst) => inst.slug === slug);
}
