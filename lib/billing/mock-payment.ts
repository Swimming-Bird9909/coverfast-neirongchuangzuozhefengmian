import { appError } from "@/lib/app-error";
import { amountFen } from "@/lib/billing/plans";
import type { PaymentPort } from "@/lib/billing/payment-port";
import { confirmCheckout, createCheckoutSession } from "@/lib/store";

export const MockPaymentPort: PaymentPort = {
  async createCheckout(input) {
    return createCheckoutSession({
      userId: input.userId,
      planId: input.planId,
      cycle: input.cycle,
      amountFen: amountFen(input.planId, input.cycle),
    });
  },
  async confirm(sessionId) {
    const paid = confirmCheckout(sessionId);
    if (!paid) {
      throw appError("payment");
    }
    return paid;
  },
};
