import { InspirationWall } from "@/components/explore/inspiration-wall";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("explore");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <InspirationWall />
    </div>
  );
}
