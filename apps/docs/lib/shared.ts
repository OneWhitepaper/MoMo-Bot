import { PRODUCT_NAME, PRODUCT_REPOSITORY_URL } from '../../../shared/product-brand';

export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
export const productName = PRODUCT_NAME;
export const appName = `${productName} Docs`;
export const appIcon = '/app-icon-192.png';
export const repositoryUrl = PRODUCT_REPOSITORY_URL;
export const repository = new URL(repositoryUrl).pathname.slice(1);
export const releasesUrl = `${repositoryUrl}/releases`;
export const docsSourceUrl = `${repositoryUrl}/blob/main/apps/docs/content/docs`;

function siteOrigin(value: string | undefined): URL | undefined {
  if (!value) return;
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('MOMO_DOCS_URL must be an HTTP(S) URL without credentials');
  }
  return new URL(url.origin);
}

export const siteUrl = siteOrigin(process.env.MOMO_DOCS_URL);
