export type CoverKind = "small" | "large";

export type CoversField = Partial<Record<CoverKind, string[]>>;

export const jsonToCoversField = (json?: any): CoversField => {
  if (!json) {
    return {};
  }
  return json as CoversField;
};
