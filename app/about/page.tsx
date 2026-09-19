export const metadata = {
  title: "关于 · 闪封面",
  description: "闪封面帮助创作者把选题做成能点开的封面。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-medium text-amber-200">关于闪封面</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">
        让封面不再拖住更新节奏
      </h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-muted-foreground">
        <p>
          闪封面 CoverFast
          是给内容创作者的封面工作台。我们相信：一条笔记、一支短视频值不值得被点开，往往在封面和标题的三秒钟里就决定了。
        </p>
        <p>
          很多人不是不会写，而是卡在画布尺寸、字号安全和平台话术上。小红书要情绪，短视频要钩子，公众号要利益点，缩略图要对比和数字。闪封面把这些惯例做成模板引擎，让你先发出去，再慢慢打磨。
        </p>
        <p>
          我们刻意把第一期做成本地可运行：不强制登录、不依赖外部 AI
          Key、不接入真实支付商户。免费额度带水印，是为了让你先体验完整链路，再决定要不要去水印、批量导出和更高积分。
        </p>
        <p>适合谁：</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>知识博主与课程作者，需要稳定的干货封面语言</li>
          <li>生活方式与测评账号，需要快速出多条封面做 A/B</li>
          <li>剪辑师与运营，需要按四平台像素一次出包</li>
        </ul>
        <p>
          后续若接入真实文生图或微信/支付宝，会走已经预留的 CoverProvider 与
          PaymentPort，页面不用推倒重来。
        </p>
        <p>
          客服邮箱：
          <a className="text-amber-200 underline" href="mailto:support@coverfast.app">
            support@coverfast.app
          </a>
        </p>
      </div>
    </div>
  );
}
