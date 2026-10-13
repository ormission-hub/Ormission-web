import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetPath = body.path || "/";
    revalidatePath(targetPath, "page");
    return NextResponse.json({ revalidated: true, path: targetPath, now: Date.now() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Revalidation failed";
    return NextResponse.json({ revalidated: false, error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";
    revalidatePath(path, "page");
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Revalidation failed";
    return NextResponse.json({ revalidated: false, error: message }, { status: 500 });
  }
}
