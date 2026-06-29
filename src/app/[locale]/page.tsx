'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { createSession, joinSession } from '@/lib/session';
import { VotingSequence } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  const t = useTranslations('home');
  const tSeq = useTranslations('sequences');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const SEQUENCE_LABELS: Record<VotingSequence, string> = {
    fibonacci: tSeq('fibonacci'),
    tshirt: tSeq('tshirt'),
    powers_of_2: tSeq('powers_of_2'),
  };

  const [createForm, setCreateForm] = useState({
    sessionName: '',
    hostName: '',
    sequence: 'fibonacci' as VotingSequence,
    anyoneCanControl: false,
    freeMode: false,
  });

  const [joinForm, setJoinForm] = useState({
    sessionCode: '',
    participantName: '',
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.sessionName.trim() || !createForm.hostName.trim()) return;
    setLoading(true);
    try {
      const sessionId = await createSession(createForm.sessionName, createForm.hostName, createForm.sequence, createForm.anyoneCanControl, createForm.freeMode);
      router.push(`/${locale}/session/${sessionId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinForm.sessionCode.trim() || !joinForm.participantName.trim()) return;
    setLoading(true);
    try {
      await joinSession(joinForm.sessionCode.trim(), joinForm.participantName);
      router.push(`/${locale}/session/${joinForm.sessionCode.trim()}`);
    } catch (err) {
      console.error(err);
      alert('Sessão não encontrada.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-end items-center gap-2 px-4 py-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <Logo size="md" />
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {t('headline')}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
              {t('tagline')}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {(['free', 'noSignup', 'realTime', 'multiLanguage'] as const).map((key) => (
              <span
                key={key}
                className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {t(`features.${key}`)}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{t('create.title')}</CardTitle>
              <CardDescription className="text-xs">{t('create.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="sessionName" className="text-xs font-medium">{t('create.sessionName')}</Label>
                  <Input
                    id="sessionName"
                    placeholder={t('create.sessionNamePlaceholder')}
                    value={createForm.sessionName}
                    onChange={(e) => setCreateForm({ ...createForm, sessionName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="hostName" className="text-xs font-medium">{t('create.yourName')}</Label>
                  <Input
                    id="hostName"
                    placeholder={t('create.yourNamePlaceholder')}
                    value={createForm.hostName}
                    onChange={(e) => setCreateForm({ ...createForm, hostName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">{t('create.sequence')}</Label>
                  <div className="flex gap-1.5 flex-wrap">
                    {(Object.keys(SEQUENCE_LABELS) as VotingSequence[]).map((seq) => (
                      <button
                        key={seq}
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, sequence: seq })}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          createForm.sequence === seq
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        {SEQUENCE_LABELS[seq]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Switch
                    id="anyoneCanControl"
                    checked={createForm.anyoneCanControl}
                    onCheckedChange={(checked) => setCreateForm({ ...createForm, anyoneCanControl: checked })}
                  />
                  <Label htmlFor="anyoneCanControl" className="text-xs font-normal text-muted-foreground cursor-pointer">
                    {t('create.anyoneCanControl')}
                  </Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <Switch
                    id="freeMode"
                    checked={createForm.freeMode}
                    onCheckedChange={(checked) => setCreateForm({ ...createForm, freeMode: checked })}
                  />
                  <Label htmlFor="freeMode" className="text-xs font-normal text-muted-foreground cursor-pointer">
                    {t('create.freeMode')}
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-1"
                  disabled={loading || !createForm.sessionName.trim() || !createForm.hostName.trim()}
                >
                  {loading ? t('create.submitting') : t('create.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{t('join.title')}</CardTitle>
              <CardDescription className="text-xs">{t('join.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="sessionCode" className="text-xs font-medium">{t('join.sessionCode')}</Label>
                  <Input
                    id="sessionCode"
                    placeholder={t('join.sessionCodePlaceholder')}
                    value={joinForm.sessionCode}
                    onChange={(e) => setJoinForm({ ...joinForm, sessionCode: e.target.value.toLowerCase() })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="participantName" className="text-xs font-medium">{t('join.yourName')}</Label>
                  <Input
                    id="participantName"
                    placeholder={t('join.yourNamePlaceholder')}
                    value={joinForm.participantName}
                    onChange={(e) => setJoinForm({ ...joinForm, participantName: e.target.value })}
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full mt-1"
                  disabled={loading || !joinForm.sessionCode.trim() || !joinForm.participantName.trim()}
                >
                  {loading ? t('join.submitting') : t('join.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
      <footer className="py-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Desenvolvido por Arthur Mota</span>
        <a
          href="https://github.com/ArthurMota9"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
          aria-label="GitHub de Arthur Mota"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </a>
      </footer>
    </main>
  );
}
