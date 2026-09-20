"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_MENU } from "@/i18n/config";
import { persistLocale } from "@/i18n/persist";
import { cn } from "@/lib/utils";
import { GlobeIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("language")}
        title={t("language")}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full border border-white/12 text-foreground transition hover:bg-white/8",
          className
        )}
      >
        <GlobeIcon className="size-4" strokeWidth={1.75} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        dir="ltr"
        className="max-h-80 min-w-44 overflow-y-auto bg-[#1a140f] text-[#f3e7d7]"
      >
        <DropdownMenuGroup>
          {LOCALE_MENU.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => {
                if (item.id !== locale) void persistLocale(item.id);
              }}
              className={cn(
                "cursor-pointer text-[15px]",
                locale === item.id && "bg-white/10 font-medium"
              )}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
