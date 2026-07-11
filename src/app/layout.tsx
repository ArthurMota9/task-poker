import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const APP_URL = 'https://task-poker.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Task Poker — Planning Poker online para times ágeis',
    template: '%s | Task Poker',
  },
  description:
    'Ferramenta gratuita de planning poker online. Estime tarefas em tempo real com seu time ágil — sem cadastro, sem instalação.',
  keywords: [
    'planning poker',
    'planning poker online',
    'estimativas ágeis',
    'scrum poker',
    'story points',
    'votação de tarefas',
    'ferramenta ágil',
    'agile',
  ],
  authors: [{ name: 'Task Poker' }],
  creator: 'Task Poker',
  openGraph: {
    type: 'website',
    url: APP_URL,
    siteName: 'Task Poker',
    title: 'Task Poker — Planning Poker online para times ágeis',
    description:
      'Estime tarefas em tempo real com seu time. Gratuito, sem cadastro, sem instalação.',
    locale: 'pt_BR',
    alternateLocale: ['en_US', 'es_ES'],
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Task Poker — Planning Poker online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Poker — Planning Poker online',
    description: 'Estime tarefas em tempo real com seu time. Gratuito e sem cadastro.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      'pt-BR': `${APP_URL}/pt`,
      'en': `${APP_URL}/en`,
      'es': `${APP_URL}/es`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
