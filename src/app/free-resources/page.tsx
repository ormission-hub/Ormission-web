import { createClient } from "@/lib/supabase/server";
import {
  FreeResourcesClient,
  type RealResourceItem,
} from "@/components/resources/free-resources-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ফ্রি স্টাডি রিসোর্স — হ্যান্ডনোট ও ফর্মুলা বুকলেট | Ormission",
  description:
    "এইচএসসি, এসএসসি ও বিশ্ববিদ্যালয় ভর্তির সকল বিষয়ের ফ্রি লেকচার শিট, হ্যান্ডনোট ও ফর্মুলা বুকলেট ডাউনলোড করুন সম্পূর্ণ বিনামূল্যে।",
};

export default async function FreeResourcesPage() {
  let resources: RealResourceItem[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resources from DB:", error);
    }

    if (data) {
      resources = data.map((r: any) => ({
        id: Number(r.id),
        title: r.title || "",
        titleBn: r.title_bn || r.title || "",
        description: r.description || "",
        category: r.category || "General",
        subject: r.subject || "",
        fileType: r.file_type || "PDF",
        fileUrl: r.file_url || "#",
        thumbnailUrl: r.thumbnail_url,
        downloadCount: Number(r.download_count || 0),
        displayOrder: Number(r.display_order || 0),
        isPublished: Boolean(r.is_published),
        createdAt: r.created_at,
      }));
    }
  } catch (err) {
    console.error("Failed to load resources:", err);
  }

  return <FreeResourcesClient initialResources={resources} />;
}
