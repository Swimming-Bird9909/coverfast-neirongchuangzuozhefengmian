import Link from "next/link";

const RELEASES = [
  {
    version: "1.1.0",
    date: "2026/09/19",
    title: "本地账号、品牌色与画布改字",
    intro: "在免登录生成之上，补齐账号显示、专业版品牌色，以及封面标题的字号与点选编辑。",
    items: [
      "定价页按月 / 按年整段可点，年付仍为 -30%",
      "模拟登录与注册写入 localStorage，页头显示账号 + 积分",
      "未登录仍可生成；下载次数和水印继续按套餐",
      "生成前明确标出标准 10 积分、高清 20 积分、批量 30 积分",
      "专业版可在生成卡与工作台选用品牌色",
      "工作台可直接在画布上改标题、副标题、角标和字号",
    ],
  },
  {
    version: "1.0.0",
    date: "2026/09/19",
    title: "闪封面正式发布 — 免登录的创作者封面工作台",
    intro: "打开就能做小红书、短视频、公众号和视频缩略图封面，并配上可发布标题。",
    items: [
      "首页即生成：文生封面 / 图生封面，无需登录",
      "四平台尺寸：1242×1660、1080×1920、900×383、1280×720",
      "六种风格模板 + 平台话术标题引擎",
      "导出 PNG；免费带水印，会员去水印并可批量出包",
      "积分与套餐：免费 80 / 创作者 800 / 专业 3000，模拟收银台开通",
      "灵感广场「用同款」，作品保存在本机",
    ],
  },
];

export const metadata = {
  title: "更新日志",
  description: "闪封面 CoverFast 的版本记录与产品动态。",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-medium text-amber-200">产品动态</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">更新日志</h1>
      <p className="mt-4 text-muted-foreground">
        查看闪封面最近上线了什么。我们保持首页免登录生成，同时把会员、品牌色和工作台打磨得更好用。
      </p>

      <div className="mt-12 space-y-12">
        {RELEASES.map((release) => (
          <article key={release.version} className="border-t border-white/10 pt-8">
            <p className="text-xs text-amber-200">
              v{release.version} · {release.date}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">{release.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{release.intro}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
              {release.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted-foreground">
        想马上试试？
        <Link href="/generate" className="mx-1 text-amber-200 underline">
          去生成器
        </Link>
        或看
        <Link href="/pricing" className="mx-1 text-amber-200 underline">
          套餐价格
        </Link>
        。
      </p>
    </div>
  );
}
