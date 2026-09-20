import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("assets");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default function AssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
