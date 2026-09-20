import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm text-amber-200">404</p>
      <h1 className="mt-2 text-3xl font-black">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">
        {t("body")}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button
          nativeButton={false}
          className="bg-amber-300 text-zinc-950 hover:bg-amber-200"
          render={<Link href="/" />}
        >
          {t("home")}
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/explore" />}>
          {t("explore")}
        </Button>
      </div>
    </div>
  );
}
