import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "কোনো ফাইল পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    // Validate file type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "শুধুমাত্র JPG, PNG, WEBP বা GIF ফরম্যাটের ছবি আপলোড করুন।",
        },
        { status: 400 }
      );
    }

    // Limit file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।" },
        { status: 400 }
      );
    }

    const imgbbKey = process.env.IMGBB_API_KEY?.trim();

    if (!imgbbKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ImgBB API Key পাওয়া যায়নি! দয়া করে .env.local ফাইলে IMGBB_API_KEY যুক্ত করুন। (https://api.imgbb.com থেকে ২ সেকেন্ডে ফ্রি কী নেওয়া যায়)",
        },
        { status: 400 }
      );
    }

    // Convert to base64 for ImgBB API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const imgbbBody = new FormData();
    imgbbBody.append("image", base64Image);
    imgbbBody.append("name", `user_${Date.now()}`);

    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      {
        method: "POST",
        body: imgbbBody,
      }
    );

    const imgbbData = await imgbbResponse.json();

    if (!imgbbResponse.ok || !imgbbData.success) {
      const errMsg =
        imgbbData?.error?.message || "ImgBB ক্লাউডে ছবি আপলোড ব্যর্থ হয়েছে।";
      console.error("ImgBB Upload Failure:", imgbbData);
      return NextResponse.json(
        { success: false, error: errMsg },
        { status: 500 }
      );
    }

    // ImgBB public direct link
    const imageUrl =
      imgbbData.data.display_url || imgbbData.data.url;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      deleteUrl: imgbbData.data.delete_url,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "ইমেজ আপলোড ব্যর্থ হয়েছে";
    console.error("Upload API Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
