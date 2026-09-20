"use client";

import { formatAppError } from "@/lib/app-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginAccount, registerAccount } from "@/lib/store";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("login");
  const te = useTranslations("errors");

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
        toast.success(t("okRegister"));
      } else {
        loginAccount({ email, password });
        toast.success(t("okLogin"));
      }
      finish();
    } catch (error) {
      toast.error(formatAppError(error, te as never, "generic"));
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
        <TabsTrigger value="login">{t("tabLogin")}</TabsTrigger>
        <TabsTrigger value="register">{t("tabRegister")}</TabsTrigger>
      </TabsList>
      <form className="space-y-3" onSubmit={onSubmit}>
        <TabsContent value="login" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("loginHint")}
          </p>
        </TabsContent>
        <TabsContent value="register" className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("registerHint")}
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="nickname">{t("nickname")}</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t("nicknamePh")}
            />
          </div>
        </TabsContent>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
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
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPh")}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="h-10 w-full bg-amber-300 text-zinc-950 hover:bg-amber-200"
        >
          {mode === "register" ? t("create") : t("submit")}
        </Button>
      </form>
    </Tabs>
  );
}
