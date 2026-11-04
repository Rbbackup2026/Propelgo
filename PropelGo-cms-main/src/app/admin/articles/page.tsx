import ContentManager from "@/components/ContentManager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function ArticlesPage() {
  return <ContentManager kind="articles" />;
}