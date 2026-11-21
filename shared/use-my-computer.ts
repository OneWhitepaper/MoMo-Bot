import { PRODUCT_URL_SCHEME } from "./product-brand.ts";

export const USE_MY_COMPUTER_URL = `${PRODUCT_URL_SCHEME}://use-my-computer`;

export function isUseMyComputerUrl(value: string): boolean {
  const url = value.trim().toLowerCase();
  return url === USE_MY_COMPUTER_URL || url === "openmausbot://use-my-computer";
}
