import type { CoverGenerateInput, CoverGenerateResult } from "@/lib/types";

export interface CoverProvider {
  generate(input: CoverGenerateInput): Promise<CoverGenerateResult>;
}

export const DEFAULT_COVER_PROVIDER_ID = "local-template" as const;
