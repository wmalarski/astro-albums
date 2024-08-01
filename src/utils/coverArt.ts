export type CoverKind = "small" | "large";

export type CoversField = Partial<Record<CoverKind, string[]>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonToCoversField = (json?: any): CoversField => {
  if (!json) {
    return {};
  }

  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
};
