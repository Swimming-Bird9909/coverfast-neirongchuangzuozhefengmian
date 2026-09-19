import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm text-amber-200">404</p>
      <h1 className="mt-2 text-3xl font-black">这一页还没有封面</h1>
      <p className="mt-3 text-muted-foreground">
        链接可能写错了。回到首页继续生成，或去灵感广场找一张同款。
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button
          nativeButton={false}
          className="bg-amber-300 text-zinc-950 hover:bg-amber-200"
          render={<Link href="/" />}
        >
          回首页
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/explore" />}>
          灵感广场
        </Button>
      </div>
    </div>
  );
}
