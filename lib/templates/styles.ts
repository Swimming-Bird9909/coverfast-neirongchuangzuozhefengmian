import type { StyleId } from "@/lib/types";

export interface CoverStyle {
  id: StyleId;
  name: string;
  tagline: string;
  basic: boolean;
  gradient: [string, string];
  accent: string;
  titleColor: string;
  subtitleColor: string;
  badgeBg: string;
  badgeColor: string;
  overlay: number;
  pattern: "dots" | "grid" | "orbs" | "slash" | "none";
  titleWeight: 700 | 900;
}

export const COVER_STYLES: Record<StyleId, CoverStyle> = {
  knowledge: {
    id: "knowledge",
    name: "知识干货",
    tagline: "清单、步骤、方法论",
    basic: true,
    gradient: ["#12263a", "#0b3b4a"],
    accent: "#5eead4",
    titleColor: "#f8fafc",
    subtitleColor: "#cbd5e1",
    badgeBg: "#5eead4",
    badgeColor: "#042f2e",
    overlay: 0.42,
    pattern: "grid",
    titleWeight: 900,
  },
  lifestyle: {
    id: "lifestyle",
    name: "生活方式",
    tagline: "松弛、质感、日常",
    basic: true,
    gradient: ["#3a241c", "#7c3a2d"],
    accent: "#fb923c",
    titleColor: "#fff7ed",
    subtitleColor: "#fed7aa",
    badgeBg: "#fb923c",
    badgeColor: "#431407",
    overlay: 0.38,
    pattern: "orbs",
    titleWeight: 700,
  },
  review: {
    id: "review",
    name: "测评种草",
    tagline: "对比、推荐、避雷",
    basic: true,
    gradient: ["#2a1030", "#7a1d4a"],
    accent: "#f472b6",
    titleColor: "#fdf2f8",
    subtitleColor: "#fbcfe8",
    badgeBg: "#f472b6",
    badgeColor: "#500724",
    overlay: 0.4,
    pattern: "dots",
    titleWeight: 900,
  },
  poster: {
    id: "poster",
    name: "大字报",
    tagline: "一句话占满画面",
    basic: false,
    gradient: ["#1a1208", "#c2410c"],
    accent: "#fbbf24",
    titleColor: "#fffbeb",
    subtitleColor: "#fde68a",
    badgeBg: "#fbbf24",
    badgeColor: "#451a03",
    overlay: 0.28,
    pattern: "slash",
    titleWeight: 900,
  },
  business: {
    id: "business",
    name: "极简商务",
    tagline: "克制、留白、专业",
    basic: false,
    gradient: ["#0f172a", "#1e293b"],
    accent: "#93c5fd",
    titleColor: "#f8fafc",
    subtitleColor: "#cbd5e1",
    badgeBg: "#e2e8f0",
    badgeColor: "#0f172a",
    overlay: 0.48,
    pattern: "none",
    titleWeight: 700,
  },
  nighttech: {
    id: "nighttech",
    name: "夜色科技",
    tagline: "霓虹、速度、未来感",
    basic: false,
    gradient: ["#050816", "#1e1b4b"],
    accent: "#22d3ee",
    titleColor: "#ecfeff",
    subtitleColor: "#a5f3fc",
    badgeBg: "#22d3ee",
    badgeColor: "#083344",
    overlay: 0.45,
    pattern: "grid",
    titleWeight: 900,
  },
};

export const STYLE_LIST = Object.values(COVER_STYLES);

export const BASIC_STYLE_IDS: StyleId[] = STYLE_LIST.filter((s) => s.basic).map(
  (s) => s.id
);

export function getStyle(id: StyleId): CoverStyle {
  return COVER_STYLES[id];
}
