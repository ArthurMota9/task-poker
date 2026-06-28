'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface SessionHeaderProps {
  sessionId: string;
  isParticipant: boolean;
  pipSupported: boolean;
  pipOpen: boolean;
  onOpenPip: () => void;
  onClosePip: () => void;
}

export function SessionHeader({
  sessionId,
  isParticipant,
  pipSupported,
  pipOpen,
  onOpenPip,
  onClosePip,
}: SessionHeaderProps) {
  const t = useTranslations('session');
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <header className="bg-card border-b px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
      <Logo size="sm" />
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
        <Button size="sm" variant="outline" className="text-xs" onClick={copyLink}>
          {copied ? t('copied') : t('copyLink')}
        </Button>
        {pipSupported && isParticipant && (
          <Button
            size="sm"
            variant={pipOpen ? 'default' : 'outline'}
            className="text-xs"
            onClick={pipOpen ? onClosePip : onOpenPip}
          >
            {pipOpen ? t('pipClose') : t('pipOpen')}
          </Button>
        )}
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
