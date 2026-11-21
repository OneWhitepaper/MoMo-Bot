import { track } from "@/lib/analytics";
import { configuredCloudPage, openExternalLink, withSource } from "@/lib/app-links";
import type { CloudSource } from "@/lib/cloud-plan";
import { WHATS_NEW_SOURCES } from "@/lib/whats-new";

export type CloudAddRequest = { source: CloudSource; signIn?: true };

/** The desktop's own MausBot Cloud sign-in, which Add a Cloud runs on: none in a browser or on a desktop showing another computer. */
export function cloudAccountBridge() {
  const desktop = globalThis.window?.ogb;
  return desktop?.remoteClient?.active ? undefined : desktop?.cloudAccount;
}

export interface CloudWebHop { url: string; via: "web" | "cloud_page"; plan?: "pro" | "team" }

export function cloudWebHop(request: CloudAddRequest, place: { cloudHome: boolean; teamCloudPage?: string }): CloudWebHop | null {
  const planPage = (place.cloudHome && place.teamCloudPage) || configuredCloudPage();
  if (!planPage) return null;
  if (place.cloudHome || request.signIn) {
    return { url: withSource(planPage, request.source), via: "cloud_page" };
  }
  const plan = request.source === WHATS_NEW_SOURCES.team ? "team" : "pro";
  const buy = new URL("/pro/buy", planPage);
  if (plan === "team") buy.searchParams.set("plan", plan);
  return { url: withSource(buy.href, request.source), via: "web", plan };
}

export function cloudSetupAvailable(): boolean {
  return Boolean(cloudAccountBridge() || configuredCloudPage());
}

export function openCloudOnWeb(request: CloudAddRequest, place: { cloudHome: boolean; teamCloudPage?: string }): void {
  const hop = cloudWebHop(request, place);
  if (!hop) return;
  void openExternalLink(hop.url).catch(() => {});
  track("cloud_checkout_opened", { ...(hop.plan ? { plan: hop.plan } : {}), source: request.source, via: hop.via });
}
