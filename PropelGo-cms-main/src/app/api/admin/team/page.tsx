import ContentManager from "@/components/ContentManager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function TeamPage() {
  return <ContentManager kind="team" />;
}