import type { Prisma } from "@prisma/client";

export type CoverKind = "small" | "large";

export type CoversField = Partial<Record<CoverKind, string[]>>;

export const jsonToCoversField = (json?: Prisma.JsonValue): CoversField => {
  if (!json) {
    return {};
  }
  return json as CoversField;
};
