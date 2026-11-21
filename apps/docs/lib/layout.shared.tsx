import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BrandTitle } from '@/components/brand-title';
import { releasesUrl, repositoryUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <BrandTitle />,
      url: '/docs',
      transparentMode: 'none',
    },
    links: [
      { text: 'Changelog', url: '/docs/changelog' },
      { type: 'button', text: 'Releases', url: releasesUrl, external: true },
    ],
    githubUrl: repositoryUrl,
  };
}
