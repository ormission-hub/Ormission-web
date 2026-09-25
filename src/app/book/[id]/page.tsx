import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookRedirectPage({ params }: PageProps) {
  const resolved = await params;
  redirect(`/books/${resolved.id}`);
}
