import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("generate");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
