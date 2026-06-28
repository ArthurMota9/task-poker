'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { joinSession } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface JoinScreenProps {
  sessionId: string;
  sessionName: string;
}

export function JoinScreen({ sessionId, sessionName }: JoinScreenProps) {
  const t = useTranslations('session');
  const [name, setName] = useState('');
  const [joining, setJoining] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setJoining(true);
    try {
      await joinSession(sessionId, name.trim());
    } catch {
      setJoining(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-none border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{sessionName}</CardTitle>
          <CardDescription className="text-xs">{t('joinDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="joinName" className="text-xs font-medium">{t('yourName')}</Label>
              <Input
                id="joinName"
                placeholder={t('yourNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={!name.trim() || joining}>
              {joining ? t('joinSubmitting') : t('joinSubmit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
