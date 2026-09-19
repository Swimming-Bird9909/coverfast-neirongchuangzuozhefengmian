"use client";

import { estimateCredits } from "@/lib/billing/credits";
import { PLANS } from "@/lib/billing/plans";
import { LocalTemplateProvider } from "@/lib/providers/local-template";
import type {
  BillingCycle,
  CheckoutSession,
  CoverAsset,
  CoverGenerateInput,
  LocalAccount,
  PlanId,
  StyleId,
  UserState,
} from "@/lib/types";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "coverfast-store-v1";

export interface AppStore {
  user: UserState;
  accounts: LocalAccount[];
  assets: CoverAsset[];
  checkouts: CheckoutSession[];
  generating: number;
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function nextMonthIso(from = new Date()): string {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function defaultUser(): UserState {
  return {
    id: uid("user"),
    signedIn: false,
    nickname: "创作者",
    email: null,
    credits: PLANS.free.credits,
    plan: "free",
    billingCycle: null,
    planExpiresAt: null,
    creditsResetAt: nextMonthIso(),
    downloadsToday: 0,
    lastDownloadDate: todayKey(),
    brandColor: "#22d3ee",
  };
}

const emptyStore: AppStore = {
  user: defaultUser(),
  accounts: [],
  assets: [],
  checkouts: [],
  generating: 0,
};

let store: AppStore = emptyStore;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    const rest = {
      user: store.user,
      accounts: store.accounts,
      assets: store.assets,
      checkouts: store.checkouts,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    try {
      const slimAssets = store.assets.map((asset) => {
        const copy = { ...asset };
        delete copy.imageDataUrl;
        return copy;
      });
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: store.user,
          accounts: store.accounts,
          assets: slimAssets,
          checkouts: store.checkouts,
        })
      );
    } catch {
      /* quota exceeded */
    }
  }
}

function refreshPeriod(user: UserState): UserState {
  const next = { ...user };
  const today = todayKey();
  if (next.lastDownloadDate !== today) {
    next.downloadsToday = 0;
    next.lastDownloadDate = today;
  }
  if (new Date(next.creditsResetAt).getTime() <= Date.now()) {
    next.credits = PLANS[next.plan].credits;
    next.creditsResetAt = nextMonthIso();
  }
  if (next.planExpiresAt && new Date(next.planExpiresAt).getTime() <= Date.now()) {
    next.plan = "free";
    next.billingCycle = null;
    next.planExpiresAt = null;
    next.credits = Math.min(next.credits, PLANS.free.credits);
  }
  return next;
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppStore>;
      store = {
        user: refreshPeriod({ ...defaultUser(), ...parsed.user }),
        accounts: parsed.accounts ?? [],
        assets: parsed.assets ?? [],
        checkouts: parsed.checkouts ?? [],
        generating: 0,
      };
    } else {
      store = { ...emptyStore, user: defaultUser() };
      persist();
    }
  } catch {
    store = { ...emptyStore, user: defaultUser() };
  }
}

function getSnapshot(): AppStore {
  hydrate();
  return store;
}

function getServerSnapshot(): AppStore {
  return emptyStore;
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAppStore(): AppStore {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function currentPlan() {
  return PLANS[getSnapshot().user.plan];
}

export function canUseStyle(styleId: StyleId): boolean {
  const plan = currentPlan();
  return plan.styles.includes(styleId);
}

export function needsWatermark(): boolean {
  return currentPlan().watermark;
}

export function signIn(nickname: string, email?: string) {
  const name = nickname.trim() || "创作者";
  store = {
    ...store,
    user: {
      ...store.user,
      signedIn: true,
      nickname: name,
      email: email?.trim().toLowerCase() || store.user.email,
    },
  };
  emit();
}

export function signOut() {
  store = {
    ...store,
    user: { ...store.user, signedIn: false },
  };
  emit();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function registerAccount(input: {
  email: string;
  password: string;
  nickname: string;
}) {
  hydrate();
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  const nickname = input.nickname.trim() || email.split("@")[0] || "创作者";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("请填写有效邮箱");
  }
  if (password.length < 4) {
    throw new Error("密码至少 4 位（仅保存在本机）");
  }
  if (store.accounts.some((a) => a.email === email)) {
    throw new Error("这个邮箱已经注册过，直接登录即可");
  }
  const account: LocalAccount = {
    email,
    password,
    nickname,
    createdAt: new Date().toISOString(),
  };
  store = {
    ...store,
    accounts: [...store.accounts, account],
    user: {
      ...store.user,
      signedIn: true,
      nickname,
      email,
    },
  };
  emit();
}

export function loginAccount(input: { email: string; password: string }) {
  hydrate();
  const email = normalizeEmail(input.email);
  const account = store.accounts.find((a) => a.email === email);
  if (!account || account.password !== input.password.trim()) {
    throw new Error("邮箱或密码不正确");
  }
  store = {
    ...store,
    user: {
      ...store.user,
      signedIn: true,
      nickname: account.nickname,
      email: account.email,
    },
  };
  emit();
}

export function setBrandColor(color: string) {
  store = {
    ...store,
    user: { ...store.user, brandColor: color },
  };
  emit();
}

export function createCheckoutSession(input: {
  userId: string;
  planId: Exclude<PlanId, "free">;
  cycle: BillingCycle;
  amountFen: number;
}): CheckoutSession {
  const session: CheckoutSession = {
    id: uid("pay"),
    userId: input.userId,
    planId: input.planId,
    cycle: input.cycle,
    amountFen: input.amountFen,
    currency: "CNY",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store = { ...store, checkouts: [session, ...store.checkouts] };
  emit();
  return session;
}

export function confirmCheckout(sessionId: string): CheckoutSession | null {
  const session = store.checkouts.find((c) => c.id === sessionId);
  if (!session || session.status !== "pending") return null;

  const plan = PLANS[session.planId];
  const expires = new Date();
  if (session.cycle === "year") expires.setFullYear(expires.getFullYear() + 1);
  else expires.setMonth(expires.getMonth() + 1);

  const paid: CheckoutSession = {
    ...session,
    status: "paid",
    paidAt: new Date().toISOString(),
  };

  store = {
    ...store,
    checkouts: store.checkouts.map((c) => (c.id === sessionId ? paid : c)),
    user: {
      ...store.user,
      plan: session.planId,
      billingCycle: session.cycle,
      planExpiresAt: expires.toISOString(),
      credits: plan.credits,
      creditsResetAt: nextMonthIso(),
      signedIn: true,
    },
  };
  emit();
  return paid;
}

export function getCheckout(sessionId: string): CheckoutSession | undefined {
  return getSnapshot().checkouts.find((c) => c.id === sessionId);
}

export async function generateCover(input: CoverGenerateInput): Promise<CoverAsset> {
  hydrate();
  const plan = currentPlan();
  const cost = estimateCredits({ quality: input.quality, batch: input.batch });

  if (!plan.styles.includes(input.styleId)) {
    throw new Error("当前套餐未解锁该风格，请升级创作者或专业会员");
  }
  if (input.batch && !plan.batchExport && !plan.fullSizePack) {
    throw new Error("四平台批量导出需要创作者或专业会员");
  }
  if (plan.concurrent !== "unlimited" && store.generating >= plan.concurrent) {
    throw new Error("免费套餐同时只能生成 1 个任务，请等待当前任务完成");
  }
  if (store.user.credits < cost) {
    throw new Error(`积分不足，本次需要 ${cost} 积分。升级会员可立即到账额度`);
  }

  store = {
    ...store,
    generating: store.generating + 1,
    user: { ...store.user, credits: store.user.credits - cost },
  };
  emit();

  try {
    const { asset } = await LocalTemplateProvider.generate({
      ...input,
      brandColor:
        plan.brandColors && input.brandColor
          ? input.brandColor
          : plan.brandColors
            ? store.user.brandColor
            : undefined,
    });
    store = { ...store, assets: [asset, ...store.assets] };
    emit();
    return asset;
  } catch (error) {
    store = {
      ...store,
      user: { ...store.user, credits: store.user.credits + cost },
    };
    emit();
    throw error;
  } finally {
    store = { ...store, generating: Math.max(0, store.generating - 1) };
    emit();
  }
}

export function updateAsset(id: string, patch: Partial<CoverAsset>) {
  store = {
    ...store,
    assets: store.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)),
  };
  emit();
}

export function deleteAsset(id: string) {
  store = { ...store, assets: store.assets.filter((a) => a.id !== id) };
  emit();
}

export function getAsset(id: string): CoverAsset | undefined {
  return getSnapshot().assets.find((a) => a.id === id);
}

export function beginDownload(): { ok: true } | { ok: false; reason: string } {
  hydrate();
  const plan = currentPlan();
  const user = refreshPeriod(store.user);
  if (user !== store.user) {
    store = { ...store, user };
    emit();
  }
  if (plan.downloadsPerDay != null && user.downloadsToday >= plan.downloadsPerDay) {
    return {
      ok: false,
      reason: `今日免费下载已达 ${plan.downloadsPerDay} 次，升级会员可无限下载`,
    };
  }
  store = {
    ...store,
    user: {
      ...store.user,
      downloadsToday: store.user.downloadsToday + 1,
      lastDownloadDate: todayKey(),
    },
  };
  emit();
  return { ok: true };
}

export function refundDownload() {
  store = {
    ...store,
    user: {
      ...store.user,
      downloadsToday: Math.max(0, store.user.downloadsToday - 1),
    },
  };
  emit();
}
