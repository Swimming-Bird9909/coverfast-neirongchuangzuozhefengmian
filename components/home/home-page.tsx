"use client";

import { InspirationWall } from "@/components/explore/inspiration-wall";
import { GenerateCard } from "@/components/generator/generate-card";
import { PlanGrid } from "@/components/pricing/plan-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PLATFORM_LIST } from "@/lib/templates/platforms";
import {
  ClapperboardIcon,
  ImageIcon,
  LayersIcon,
  SparklesIcon,
  TypeIcon,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: SparklesIcon,
    title: "免费体验封面生成",
    body: "打开就能做。每月 80 积分，免登录试用文生封面与图生封面，先看到成片再决定要不要升级。",
  },
  {
    icon: TypeIcon,
    title: "同时支持文生封面和图生封面",
    body: "输入选题立刻出主标题与角标；上传参考图则铺成背景。风格可换，平台尺寸一键切换。",
  },
  {
    icon: ImageIcon,
    title: "秒出四平台尺寸",
    body: "小红书 3:4、短视频 9:16、公众号 2.35:1、视频缩略图 16:9，按平台惯例像素导出 PNG。",
  },
  {
    icon: LayersIcon,
    title: "标题与封面一起出",
    body: "小红书走情绪、短视频走钩子、公众号走利益、缩略图走数字反差。封面不再和标题各写各的。",
  },
  {
    icon: ClapperboardIcon,
    title: "适用全内容场景",
    body: "知识博主、生活方式、测评种草、商务专栏都能直接套风格。会员可去水印并批量打包。",
  },
];

const FAQS = [
  {
    q: "可以导出哪些尺寸？",
    a: "目前内置四种内容平台惯例尺寸：小红书封面 1242×1660、短视频封面 1080×1920、公众号头图 900×383、视频缩略图 1280×720。创作者与专业会员可一次导出全尺寸包。",
  },
  {
    q: "需要设计或剪辑基础吗？",
    a: "不需要。闪封面按选题生成标题层级、角标和安全区。你只需改几个字、换一种风格，就可以导出能发的 PNG。",
  },
  {
    q: "图生封面有多还原参考图？",
    a: "首期用本地模板引擎：参考图作为背景铺满，再叠风格光影、标题与角标。它保证发得出、字能看清；后续可在 CoverProvider 接入真实图像模型而不改页面。",
  },
  {
    q: "封面能商用吗？",
    a: "可以。你对自己输入的选题与参考图负责。付费会员导出无水印文件，可用于账号运营与商业内容。免费方案导出带「闪封面」水印。",
  },
  {
    q: "生成数量有限制吗？",
    a: "有。标准生成 10 积分、高清 20 积分、四平台批量 30 积分，生成前会显示预计消耗。免费账户每月 80 积分、每天 3 次下载；付费方案提供更高额度与无限下载。",
  },
  {
    q: "如何获得支持？",
    a: "写信到 support@coverfast.app。我们通常在工作日 24 小时内回复，帮助你把封面发到对应平台。",
  },
  {
    q: "生成一张封面要多久？",
    a: "本地模板通常 1 秒内完成。界面会按套餐展示队列：免费显示标准队列，专业会员显示优先队列。你随时可以离开，作品会出现在「我的作品」。",
  },
  {
    q: "积分系统如何运作？",
    a: "积分只在生成为封面时扣除。标准 10、高清 20、四平台批量 30。免费用户可用来源基础风格；会员解锁大字报、极简商务、夜色科技，并可去水印。生成前始终显示本次预计消耗。",
  },
  {
    q: "可以 API 接入吗？",
    a: "网页工作台是当前重点。CoverProvider 与 PaymentPort 已按可替换接口预留，后续图像模型与微信/支付宝/Stripe 可以不改页面直接接入。",
  },
];

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 bg-size-[56px_56px] bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 md:pt-24">
          <p className="mb-4 text-center text-sm font-medium tracking-wide text-amber-200">
            闪电般快速的创作者封面生成器
          </p>
          <h1 className="text-center text-4xl leading-[1.08] font-black tracking-tight text-balance sm:text-6xl md:text-7xl">
            文字或图片，
            <span className="bg-linear-to-r from-amber-200 via-orange-300 to-cyan-300 bg-clip-text text-transparent">
              几秒变成能点开的封面
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-7 text-muted-foreground md:text-lg">
            输入选题或上传参考图，立刻生成小红书、短视频、公众号与视频缩略图封面，并配上可发布的标题。
            免费开始，无需登录。
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              className="h-11 bg-amber-300 px-5 text-zinc-950 hover:bg-amber-200"
              render={<Link href="#generate" />}
            >
              免费开始
            </Button>
            <Button variant="outline" className="h-11" render={<Link href="/explore" />}>
              逛灵感广场
            </Button>
          </div>

          <div id="generate" className="mx-auto mt-12 max-w-3xl">
            <GenerateCard compact />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-sm font-medium text-amber-200">四平台封面引擎</p>
        <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
          一次选题，按平台话术长出封面
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          专业级标题层级、角标和安全区。从概念到可发布 PNG，不必再在设计工具里对齐像素。
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_LIST.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/8 bg-white/3 p-5"
            >
              <p className="text-xs text-amber-200">{p.ratio}</p>
              <h3 className="mt-2 text-lg font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {p.width}×{p.height} · {p.titleHint}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">多样化生成方式</h2>
        <p className="mt-2 text-muted-foreground">
          把基础生成式封面能力做进浏览器，支持多种输入方式
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 bg-[#101218] p-5"
            >
              <f.icon className="mb-3 size-5 text-amber-300" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <InspirationWall limit={8} />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">
          常见问题解答
        </h2>
        <Accordion className="mt-8">
          {FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">
          满足各种需求的方案
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          选择适合你更新节奏的计划，从偶尔发笔记的爱好者到日更工作室。
        </p>
        <div className="mt-10">
          <PlanGrid teaser />
        </div>
      </section>

      <section className="border-t border-white/8 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.12),transparent_55%)]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            把你的选题变成会被点开的封面
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            加入正在用闪封面赶更新的创作者。几秒钟出图，而不是在画布上耗掉一个下午。
          </p>
          <Button
            className="mt-8 h-12 bg-amber-300 px-8 text-base text-zinc-950 hover:bg-amber-200"
            render={<Link href="/generate" />}
          >
            立即免费生成
          </Button>
        </div>
      </section>
    </>
  );
}
