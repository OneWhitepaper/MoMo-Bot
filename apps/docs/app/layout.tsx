import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from '@/components/provider';
import { appIcon, appName, siteUrl } from '@/lib/shared';
import './global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: appName,
    template: `%s · ${appName}`,
  },
  description: 'Install, configure and extend MoMo bot, a local workspace for your team of AI agents.',
  openGraph: {
    title: appName,
    siteName: appName,
    description: 'Your own team of AI agents, in a chat app.',
    type: 'website',
  },
  icons: {
    icon: appIcon,
    apple: '/apple-touch-icon.png',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
