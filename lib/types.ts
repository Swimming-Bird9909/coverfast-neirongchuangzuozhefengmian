export type PlatformId =
  | "xiaohongshu"
  | "shortvideo"
  | "wechat"
  | "thumbnail";

export type StyleId =
  | "knowledge"
  | "lifestyle"
  | "review"
  | "poster"
  | "business"
  | "nighttech";

export type Quality = "standard" | "hd";

export type PlanId = "free" | "creator" | "pro";

export type BillingCycle = "month" | "year";

export type GenerateMode = "text" | "image";

export type AssetStatus = "ready" | "exporting";

export interface CoverAsset {
  id: string;
  topic: string;
  mode: GenerateMode;
  imageDataUrl?: string;
  platformId: PlatformId;
  styleId: StyleId;
  quality: Quality;
  title: string;
  subtitle: string;
  badge: string;
  titles: string[];
  selectedTitleIndex: number;
  createdAt: string;
  status: AssetStatus;
  brandColor?: string;
  batch?: boolean;
  titleScale?: number;
}

export interface LocalAccount {
  email: string;
  password: string;
  nickname: string;
  createdAt: string;
}

export interface UserState {
  id: string;
  signedIn: boolean;
  nickname: string;
  email: string | null;
  credits: number;
  plan: PlanId;
  billingCycle: BillingCycle | null;
  planExpiresAt: string | null;
  creditsResetAt: string;
  downloadsToday: number;
  lastDownloadDate: string;
  brandColor: string;
}

export interface CheckoutSession {
  id: string;
  userId: string;
  planId: Exclude<PlanId, "free">;
  cycle: BillingCycle;
  amountFen: number;
  currency: "CNY";
  status: "pending" | "paid" | "canceled";
  createdAt: string;
  paidAt?: string;
}

export interface CoverGenerateInput {
  mode: GenerateMode;
  topic: string;
  imageDataUrl?: string;
  platformId: PlatformId;
  styleId: StyleId;
  quality: Quality;
  brandColor?: string;
  batch?: boolean;
}

export interface CoverGenerateResult {
  asset: CoverAsset;
}
