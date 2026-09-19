import { PlanGrid } from "@/components/pricing/plan-grid";

export const metadata = {
  title: "定价 · 闪封面",
  description: "免费、创作者、专业三档。年付立减 30%。",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-amber-200">积分与会员</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          选一个跟得上你更新频率的方案
        </h1>
        <p className="mt-4 text-muted-foreground">
          标准生成 10 积分，高清 20 积分，四平台批量 30 积分。生成前会显示预计消耗。
          年付比月付便宜 30%。支付当前为模拟收银台，确认即写入会员与积分。
        </p>
      </div>
      <div className="mt-12">
        <PlanGrid />
      </div>
    </div>
  );
}
