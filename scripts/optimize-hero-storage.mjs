import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import https from "https";
import fs from "fs";
import path from "path";

const SUPABASE_URL = "https://oorovtqwyfrfjfwuufyi.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vcm92dHF3eWZyZmpmd3V1ZnlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTMwMzU4NiwiZXhwIjoyMTA0ODc5NTg2fQ.AAjyIcAYAJrix9KgTGd__SWZqWzS7Ew4iSsDxXz7pvc";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
  });
}

async function optimizeAndUpload() {
  console.log("Fetching hero settings from Supabase...");
  const { data: setting, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero_settings")
    .single();

  if (error || !setting?.value) {
    console.error("Failed to fetch hero_settings:", error);
    return;
  }

  const heroData = setting.value;
  const updatedPhotos = [];

  for (const photo of heroData.photos) {
    console.log(`\nProcessing: ${photo.title} (${photo.url})`);
    if (photo.url.endsWith(".jpeg") || photo.url.endsWith(".jpg")) {
      console.log(`Downloading ${photo.url}...`);
      const originalBuffer = await fetchBuffer(photo.url);
      console.log(`Original size: ${(originalBuffer.length / 1024).toFixed(1)} KB`);

      const optimizedWebp = await sharp(originalBuffer)
        .resize(1920, null, { withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toBuffer();

      console.log(`Optimized WebP size: ${(optimizedWebp.length / 1024).toFixed(1)} KB`);

      // Determine new file name
      const oldFilename = photo.url.split("/").pop();
      const newFilename = oldFilename.replace(/\.(jpeg|jpg)$/i, ".webp");

      console.log(`Uploading ${newFilename} to hero_images bucket...`);
      const { error: uploadError } = await supabase.storage
        .from("hero_images")
        .upload(newFilename, optimizedWebp, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        updatedPhotos.push(photo);
        continue;
      }

      const { data: publicData } = supabase.storage
        .from("hero_images")
        .getPublicUrl(newFilename);

      const newUrl = publicData.publicUrl;
      console.log(`Success! New URL: ${newUrl}`);

      // If it's order 1, also save locally to public/images/hero-banner-main.webp
      if (photo.order === 1) {
        const localPath = path.resolve("./public/images/hero-banner-main.webp");
        fs.writeFileSync(localPath, optimizedWebp);
        console.log(`Saved locally to ${localPath}`);
      }

      updatedPhotos.push({
        ...photo,
        url: newUrl,
        file_size: optimizedWebp.length,
      });
    } else {
      updatedPhotos.push(photo);
    }
  }

  // Update site_settings
  const updatedHeroData = {
    ...heroData,
    photos: updatedPhotos,
    active_image_url:
      updatedPhotos.find((p) => p.order === 1)?.url || heroData.active_image_url,
  };

  console.log("\nUpdating site_settings in Supabase...");
  const { error: updateError } = await supabase
    .from("site_settings")
    .update({ value: updatedHeroData })
    .eq("key", "hero_settings");

  if (updateError) {
    console.error("Error updating site_settings:", updateError);
  } else {
    console.log("✅ hero_settings updated in Supabase successfully!");
  }
}

optimizeAndUpload();
