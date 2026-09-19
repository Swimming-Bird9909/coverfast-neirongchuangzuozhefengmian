"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginAccount, registerAccount } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AuthForm({
  next = "/",
  onDone,
}: {
  next?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);

  function finish() {
    onDone?.();
    router.push(next);
    router.refresh();
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        registerAccount({ email, password, nickname });
        toast.success("账号已记在这台浏览器，生成仍然可以不登录");
      } else {
        loginAccount({ email, password });
        toast.success("已登录，积分与会员仍按本机记录计算");
      }
      finish();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Tabs
      value={mode}
      onValueChange={(v) => {
        if (v === "login" || v === "register") setMode(v);
      }}
    >
      <TabsList className="mb-4">
        <TabsTrigger value="login">登录</TabsTrigger>
        <TabsTrigger value="register">注册</TabsTrigger>
      </TabsList>
      <form className="space-y-3" onSubmit={onSubmit}>
        <TabsContent value="login" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            模拟账号，不发短信、不走 OAuth。免费生成不需要登录。
          </p>
        </TabsContent>
        <TabsContent value="register" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            注册只把邮箱和昵称写进 localStorage，方便页头显示账号与积分。
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="nickname">昵称</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="怎么称呼你"
            />
          </div>
        </TabsContent>
        <div className="space-y-1.5">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少 4 位，仅本机保存"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="h-10 w-full bg-amber-300 text-zinc-950 hover:bg-amber-200"
        >
          {mode === "register" ? "创建本地账号" : "登录"}
        </Button>
      </form>
    </Tabs>
  );
}
