'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Session, Task, Participant } from '@/types';
import { revealVotes, finishTask, finishFreeRound } from '@/lib/session';
import { VotingCards } from '@/components/session/VotingCards';
import { VoteResults } from '@/components/session/VoteResults';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CONSENSUS_MESSAGES: Record<string, string[]> = {
  pt: [
    'Que time alinhado, ein papai?',
    'Todo mundo dormindo no mesmo travesseiro hoje.',
    'Até o estagiário acertou. Isso é histórico.',
    'Unanimidade total! O Scrum Master vai chorar.',
    'Consenso? Alguém está mentindo... mas tudo bem.',
  ],
  en: [
    'Perfect consensus! Did someone share the answers?',
    'The whole team thought the same thing. Suspicious.',
    'Unanimous! The Scrum Master sheds a single tear.',
    'No debates today. Someone check if everyone is okay.',
    'Everyone agreed? Screenshot this, it may never happen again.',
  ],
  es: [
    '¡Consenso total! ¿Alguien compartió las respuestas?',
    'Todo el mundo pensó lo mismo. Sospechoso.',
    '¡Unanimidad! El Scrum Master llora de alegría.',
    'Sin debates hoy. Alguien revise si todos están bien.',
    '¿Todos de acuerdo? Capturen esto, puede que no vuelva a pasar.',
  ],
};

interface VotingAreaProps {
  sessionId: string;
  session: Session;
  currentTask: Task | null;
  userId: string | null;
  canControl: boolean;
  participants: Record<string, Participant>;
  totalParticipants: number;
  myVote: string | null;
  onVote: (value: string) => void;
  onClearVotes?: () => void;
}

export function VotingArea({
  sessionId,
  session,
  currentTask,
  canControl,
  participants,
  totalParticipants,
  myVote,
  onVote,
  onClearVotes = () => {},
}: VotingAreaProps) {
  const t = useTranslations('session');
  const locale = useLocale();
  const isRevealed = session.status === 'revealed';
  const totalVotes = currentTask ? Object.keys(currentTask.votes).length : 0;

  const [consensusMessage, setConsensusMessage] = useState<string | null>(null);
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
          colors: ['#a9812e', '#d9b866', '#8a3226', '#f1ead8', '#3f5c4a'],
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

  return (
    <>
      {/* Consensus toast — fixed overlay */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          consensusMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-card border shadow-lg rounded-xl px-5 py-2 text-sm font-medium text-foreground whitespace-nowrap">
          {consensusMessage}
        </div>
      </div>

      {currentTask ? (
        <Card className="shadow-none border">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">
                  {t('votingNow')}
                </p>
                {!session.freeMode && (
                  <CardTitle className={cn('text-lg font-semibold', !currentTask.title && 'text-muted-foreground italic font-normal')}>
                    {currentTask.title || t('untitled')}
                  </CardTitle>
                )}
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
              <div className="rounded-xl bg-background px-3 py-7 ring-1 ring-inset ring-foreground/10 sm:px-6">
                <VotingCards
                  sequence={session.votingSequence}
                  customSequence={session.customSequence}
                  selectedValue={myVote}
                  onVote={onVote}
                  disabled={false}
                />
              </div>
            </div>

            <Separator />

            <div className="flex gap-2 justify-center flex-wrap">
              {!isRevealed && canControl && (
                <Button size="sm" onClick={() => revealVotes(sessionId, currentTask.id)} disabled={totalVotes === 0}>
                  {t('revealVotes')}
                </Button>
              )}
              {canControl && (
                <Button size="sm" variant="outline" onClick={onClearVotes}>
                  {t('clearVotes')}
                </Button>
              )}
              {isRevealed && canControl && !session.freeMode && (
                <Button size="sm" onClick={() => finishTask(sessionId, currentTask.id)}>
                  {t('finishTask')}
                </Button>
              )}
              {isRevealed && canControl && session.freeMode && (
                <Button size="sm" onClick={() => finishFreeRound(sessionId, currentTask.id)}>
                  {t('finishRound')}
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
    </>
  );
}
