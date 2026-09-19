import type { BillingCycle, CheckoutSession, PlanId } from "@/lib/types";

export interface CreateCheckoutInput {
  userId: string;
  planId: Exclude<PlanId, "free">;
  cycle: BillingCycle;
}

export interface PaymentPort {
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession>;
  confirm(sessionId: string): Promise<CheckoutSession>;
}
