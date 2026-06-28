import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const APP_URL = 'https://task-poker-03c89dc46d91.herokuapp.com';

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
        url: '/opengraph-image',
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
    images: ['/opengraph-image'],
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
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
