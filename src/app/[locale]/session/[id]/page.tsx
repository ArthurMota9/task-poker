'use client';

export const dynamic = 'force-dynamic';

import { use, useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { useSession } from '@/hooks/useSession';
import { useTimer } from '@/hooks/useTimer';
import { usePictureInPicture } from '@/hooks/usePictureInPicture';
import { addTask, startVoting, castVote, revealVotes, finishTask, joinSession } from '@/lib/session';
import { VotingCards } from '@/components/session/VotingCards';
import { ParticipantList } from '@/components/session/ParticipantList';
import { TaskManager } from '@/components/session/TaskManager';
import { VoteResults } from '@/components/session/VoteResults';
import { SessionHistory } from '@/components/session/SessionHistory';
import { PipPanel } from '@/components/session/PipPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Logo } from '@/components/Logo';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function SessionPage({ params }: PageProps) {
  const { id } = use(params);
  const t = useTranslations('session');
  const locale = useLocale();
  const { session, userId, loading, isHost } = useSession(id);
  const { formatted: timerFormatted } = useTimer(session?.createdAt ?? null);
  const { pipWindow, isSupported: pipSupported, isOpen: pipOpen, openPip, closePip } = usePictureInPicture();
  const [myVote, setMyVote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [consensusMessage, setConsensusMessage] = useState<string | null>(null);
  const [joinName, setJoinName] = useState('');
  const [joining, setJoining] = useState(false);

  const currentTask = session?.currentTaskId ? session.tasks[session.currentTaskId] : null;
  const isRevealed = session?.status === 'revealed';
  const isParticipant = !!(userId && session?.participants?.[userId]?.name);
  const canControl = isHost || !!session?.anyoneCanControl;

  useEffect(() => {
    setMyVote(null);
  }, [session?.currentTaskId]);

  const CONSENSUS_MESSAGES: Record<string, string[]> = {
    pt: [
      'Que time alinhado, ein papai?',
      'Consenso na primeira rodada! Isso sim é trabalho em equipe.',
      'Todo mundo na mesma página. Raro, mas acontece!',
      'Unanimidade total! O time está em sintonia.',
      'Sem discussão hoje. Missão cumprida!',
    ],
    en: [
      'Perfect consensus! The team is fully aligned.',
      "Everyone on the same page — that's rare, cherish it!",
      'Unanimous! The team is in perfect sync.',
      'No debates today. Mission accomplished.',
      "First-round consensus! That's teamwork right there.",
    ],
    es: [
      '¡Consenso total! El equipo está completamente alineado.',
      '¡Todos en la misma página! Eso es trabajo en equipo.',
      '¡Unanimidad! El equipo está en perfecta sintonía.',
      '¡Sin debates hoy! Misión cumplida.',
      '¡Consenso en la primera ronda! Así se trabaja.',
    ],
  };

  const celebratedTaskRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isRevealed || !currentTask) return;
    const taskKey = `consensus-${currentTask.id}`;
    if (celebratedTaskRef.current === taskKey || sessionStorage.getItem(taskKey)) return;
    celebratedTaskRef.current = taskKey;
    sessionStorage.setItem(taskKey, '1');

    const votes = Object.values(currentTask.votes);
    if (votes.length < 2) return;
    const allSame = new Set(votes.map((v) => v.value)).size === 1;
    if (!allSame) return;

    const messages = CONSENSUS_MESSAGES[locale] ?? CONSENSUS_MESSAGES.en;
    const seed = currentTask.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const message = messages[seed % messages.length];
    setConsensusMessage(message);
    setTimeout(() => setConsensusMessage(null), 5000);

    import('canvas-confetti').then(({ default: confetti }) => {
      const shoot = (angle: number, origin: { x: number; y: number }) => {
        confetti({
          angle,
          spread: 55,
          particleCount: 80,
          origin,
          colors: ['#4f46e5', '#818cf8', '#c7d2fe', '#facc15', '#fb923c'],
        });
      };
      shoot(60, { x: 0, y: 0.65 });
      shoot(120, { x: 1, y: 0.65 });
      setTimeout(() => {
        shoot(70, { x: 0.1, y: 0.6 });
        shoot(110, { x: 0.9, y: 0.6 });
      }, 200);
      setTimeout(() => {
        shoot(90, { x: 0.5, y: 0.5 });
      }, 400);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed, currentTask]);

  const handleVote = useCallback(async (value: string) => {
    if (!userId || !session?.currentTaskId) return;
    setMyVote(value);
    await castVote(id, session.currentTaskId, userId, value);
  }, [id, userId, session?.currentTaskId]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinName.trim()) return;
    setJoining(true);
    try {
      await joinSession(id, joinName.trim());
    } catch {
      setJoining(false);
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">{t('loading')}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-base font-semibold">{t('notFound')}</p>
          <p className="text-muted-foreground text-sm">{t('notFoundDescription')}</p>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/')}>
            {t('backHome')}
          </Button>
        </div>
      </div>
    );
  }

  if (!isParticipant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-none border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{session.name}</CardTitle>
            <CardDescription className="text-xs">{t('joinDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="joinName" className="text-xs font-medium">{t('yourName')}</Label>
                <Input
                  id="joinName"
                  placeholder={t('yourNamePlaceholder')}
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={!joinName.trim() || joining}>
                {joining ? t('joinSubmitting') : t('joinSubmit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const participants = session.participants ?? {};
  const history = session.history ?? {};
  const tasks = session.tasks ?? {};
  const totalVotes = currentTask ? Object.keys(currentTask.votes).length : 0;
  const totalParticipants = Object.keys(participants).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-medium text-foreground">{session.name}</span>
            <span className="text-muted-foreground text-xs font-mono">{id}</span>
            <Badge variant="secondary" className="text-xs font-medium tabular-nums">
              {timerFormatted}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={copyLink}>
            {copied ? t('copied') : t('copyLink')}
          </Button>
          {pipSupported && isParticipant && (
            <Button
              size="sm"
              variant={pipOpen ? 'default' : 'outline'}
              className="text-xs"
              onClick={pipOpen ? closePip : () => openPip(280, 290)}
            >
              {pipOpen ? t('pipClose') : t('pipOpen')}
            </Button>
          )}
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {pipWindow && (
        <PipPanel
          pipWindow={pipWindow}
          task={currentTask}
          sessionName={session.name}
          sequence={session.votingSequence}
          selectedVote={myVote}
          revealed={isRevealed}
          totalVotes={totalVotes}
          totalParticipants={totalParticipants}
          participants={participants}
          timerFormatted={timerFormatted}
          onVote={handleVote}
          onReveal={() => currentTask && revealVotes(id, currentTask.id)}
          onClose={closePip}
        />
      )}

      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          consensusMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-card border shadow-lg rounded-xl px-5 py-3 text-sm font-medium text-foreground whitespace-nowrap">
          {consensusMessage}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-4">
          <Card className="shadow-none border">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {t('participants')} · {totalParticipants}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <ParticipantList
                participants={participants}
                currentTask={currentTask}
                revealed={isRevealed}
                currentUserId={userId}
              />
            </CardContent>
          </Card>
          <SessionHistory history={history} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          {currentTask ? (
            <Card className="shadow-none border">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">
                      {t('votingNow')}
                    </p>
                    <CardTitle className={cn('text-lg font-semibold', !currentTask.title && 'text-muted-foreground italic font-normal')}>
                      {currentTask.title || t('untitled')}
                    </CardTitle>
                  </div>
                  <Badge variant={isRevealed ? 'default' : 'secondary'} className="text-xs shrink-0">
                    {isRevealed ? t('revealed') : t('votes', { current: totalVotes, total: totalParticipants })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {isRevealed && <VoteResults task={currentTask} participants={participants} />}

                <div className="space-y-3">
                  {!isRevealed && (
                    <p className="text-xs text-center text-muted-foreground">{t('chooseEstimate')}</p>
                  )}
                  <VotingCards
                    sequence={session.votingSequence}
                    selectedValue={myVote}
                    onVote={handleVote}
                    disabled={false}
                  />
                </div>

                <Separator />

                <div className="flex gap-2 justify-center">
                  {!isRevealed && canControl && (
                    <Button size="sm" onClick={() => revealVotes(id, currentTask.id)} disabled={totalVotes === 0}>
                      {t('revealVotes')}
                    </Button>
                  )}
                  {isRevealed && canControl && (
                    <Button size="sm" onClick={() => finishTask(id, currentTask.id)}>
                      {t('finishTask')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-none border">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                {canControl ? t('hostWaiting') : t('guestWaiting')}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-none border">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {t('tasks')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <TaskManager
                tasks={tasks}
                currentTaskId={session.currentTaskId}
                isHost={canControl}
                onAddTask={(title) => addTask(id, title)}
                onStartVoting={(taskId) => startVoting(id, taskId)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
