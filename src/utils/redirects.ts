export const redirectToYt = (title: string, name: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  const value = `${title ?? ""} ${name ?? ""}`;
  const params = new URLSearchParams({ search_query: value });
  const link = `https://www.youtube.com/results?${params}`;
  window.open(link, "_blank");
};

export const redirectToGoogle = (title: string, name: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  const value = `${title ?? ""} ${name ?? ""}`;
  const params = new URLSearchParams({ q: value });
  const link = `https://www.google.com/search?${params}`;
  window.open(link, "_blank");
};
