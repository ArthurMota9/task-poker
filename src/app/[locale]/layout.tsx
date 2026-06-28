import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const APP_URL = 'https://task-poker.com';

const LOCALE_META: Record<string, { title: string; description: string; ogLocale: string }> = {
  pt: {
    title: 'Task Poker — Planning Poker online para times ágeis',
    description: 'Ferramenta gratuita de planning poker online. Estime tarefas em tempo real com seu time — sem cadastro, sem instalação.',
    ogLocale: 'pt_BR',
  },
  en: {
    title: 'Task Poker — Free Online Planning Poker for Agile Teams',
    description: 'Free online planning poker tool. Estimate tasks in real-time with your agile team — no sign-up, no installation.',
    ogLocale: 'en_US',
  },
  es: {
    title: 'Task Poker — Planning Poker online gratuito para equipos ágiles',
    description: 'Herramienta gratuita de planning poker online. Estima tareas en tiempo real con tu equipo — sin registro, sin instalación.',
    ogLocale: 'es_ES',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = LOCALE_META[locale] ?? LOCALE_META.pt;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${APP_URL}/${locale}`,
      languages: {
        'pt-BR': `${APP_URL}/pt`,
        'en': `${APP_URL}/en`,
        'es': `${APP_URL}/es`,
        'x-default': `${APP_URL}/pt`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${APP_URL}/${locale}`,
      locale: meta.ogLocale,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'pt' | 'en' | 'es')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
