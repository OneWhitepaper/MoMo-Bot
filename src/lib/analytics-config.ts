export function analyticsToken(): string {
  return import.meta.env?.VITE_MOMO_ANALYTICS_TOKEN?.trim() ?? "";
}

export function analyticsConfigured(): boolean {
  return Boolean(analyticsToken());
}
