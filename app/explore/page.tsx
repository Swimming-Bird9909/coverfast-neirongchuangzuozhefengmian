import { InspirationWall } from "@/components/explore/inspiration-wall";

export const metadata = {
  title: "灵感广场 · 闪封面",
  description: "浏览创作者封面，一键用同款进入生成器。",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <InspirationWall />
    </div>
  );
}
