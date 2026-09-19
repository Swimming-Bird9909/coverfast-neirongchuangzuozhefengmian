import Link from "next/link";
import { ZapIcon } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#05060a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 font-black">
            <ZapIcon className="size-4 text-amber-300" />
            闪封面 CoverFast
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            给内容创作者的封面与标题工作台。免费开始，无需登录。后期可替换为真实支付与图像模型，不改页面结构。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">产品</span>
            <Link className="text-muted-foreground hover:text-foreground" href="/generate">
              生成器
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/explore">
              灵感广场
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/assets">
              我的作品
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">商业</span>
            <Link className="text-muted-foreground hover:text-foreground" href="/pricing">
              定价
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/about">
              关于
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">支持</span>
            <a
              className="text-muted-foreground hover:text-foreground"
              href="mailto:support@coverfast.app"
            >
              support@coverfast.app
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} 闪封面 CoverFast · 模板引擎本地渲染，不上传你的选题
      </div>
    </footer>
  );
}
