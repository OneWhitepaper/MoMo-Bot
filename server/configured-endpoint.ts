export function configuredEndpoint(value: string | undefined | null): URL | null {
  if (!value?.trim()) return null;
  const url = URL.parse(value.trim());
  if (!url || url.username || url.password) return null;
  const loopback = url.protocol === "http:" && ["127.0.0.1", "[::1]", "localhost"].includes(url.hostname);
  return url.protocol === "https:" || loopback ? url : null;
}
