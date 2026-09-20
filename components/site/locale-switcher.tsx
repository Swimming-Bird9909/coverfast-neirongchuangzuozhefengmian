"use client";

import { LOCALE_MENU, type AppLocale } from "@/i18n/config";
import { persistLocale } from "@/i18n/persist";
import { cn } from "@/lib/utils";
import { GlobeIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_WIDTH = 176;
const MENU_GAP = 8;

function placeMenu(button: HTMLElement) {
  const rect = button.getBoundingClientRect();
  const width = MENU_WIDTH;
  const maxLeft = window.innerWidth - width - MENU_GAP;
  let left = rect.right - width;
  left = Math.min(Math.max(MENU_GAP, left), Math.max(MENU_GAP, maxLeft));
  const top = Math.min(rect.bottom + MENU_GAP, window.innerHeight - MENU_GAP);
  return { top, left };
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const update = () => setCoords(placeMenu(buttonRef.current!));
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function choose(id: AppLocale) {
    if (id === locale || busy) {
      setOpen(false);
      return;
    }
    setBusy(true);
    setOpen(false);
    await persistLocale(id);
  }

  return (
    <div className="relative z-[80]">
      <button
        ref={buttonRef}
        type="button"
        aria-label={t("language")}
        title={t("language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={busy}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className={cn(
          "relative z-[80] inline-flex size-9 items-center justify-center rounded-full border border-white/12 text-foreground transition hover:bg-white/8",
          open && "bg-white/10",
          className
        )}
      >
        <GlobeIcon className="pointer-events-none size-4" strokeWidth={1.75} />
      </button>
      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              dir="ltr"
              aria-label={t("language")}
              className="fixed z-[400] max-h-80 min-w-44 overflow-y-auto rounded-lg bg-[#1a140f] p-1 text-[#f3e7d7] shadow-lg ring-1 ring-white/15"
              style={{
                top: coords.top,
                left: coords.left,
                width: MENU_WIDTH,
              }}
            >
              {LOCALE_MENU.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={item.id === locale}
                  disabled={busy}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void choose(item.id);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer rounded-md px-3 py-2 text-left text-[15px] hover:bg-white/10",
                    item.id === locale && "bg-white/10 font-medium"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
