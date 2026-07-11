'use client';

export const dynamic = 'force-dynamic';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from '@/hooks/useSession';
import { usePictureInPicture } from '@/hooks/usePictureInPicture';
import { castVote, clearVotes, addTask, startVoting, revealVotes } from '@/lib/session';
import { ParticipantList } from '@/components/session/ParticipantList';
import { TaskManager } from '@/components/session/TaskManager';
import { SessionHistory } from '@/components/session/SessionHistory';
import { PipPanel } from '@/components/session/PipPanel';
import { JoinScreen } from '@/components/session/JoinScreen';
import { SessionHeader } from '@/components/session/SessionHeader';
import { SessionInfo } from '@/components/session/SessionInfo';
import { VotingArea } from '@/components/session/VotingArea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function SessionPage({ params }: PageProps) {
  const { id } = use(params);
  const t = useTranslations('session');
  const { session, userId, loading, isHost } = useSession(id);
  const { pipWindow, isSupported: pipSupported, isOpen: pipOpen, openPip, closePip } = usePictureInPicture();
  const currentTask = session?.currentTaskId ? session.tasks[session.currentTaskId] : null;
  const isRevealed = session?.status === 'revealed';
  const isParticipant = !!(userId && session?.participants?.[userId]?.name);
  const canControl = isHost || !!session?.anyoneCanControl;
  const participants = session?.participants ?? {};
  const history = session?.history ?? {};
  const tasks = session?.tasks ?? {};
  const totalParticipants = Object.keys(participants).length;
  const totalVotes = currentTask ? Object.keys(currentTask.votes).length : 0;
  // Derived from Firestore rather than local state, so a "clear votes" from
  // any participant reflects immediately on every board, not just the caller's.
  const myVote = userId && currentTask ? (currentTask.votes[userId]?.value ?? null) : null;

  async function handleVote(value: string) {
    if (!userId || !session?.currentTaskId) return;
    await castVote(id, session.currentTaskId, userId, value);
  }

  async function handleClearVotes() {
    if (!session?.currentTaskId) return;
    await clearVotes(id, session.currentTaskId);
  }

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
    return <JoinScreen sessionId={id} sessionName={session.name} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SessionHeader
        sessionId={id}
        isParticipant={isParticipant}
        pipSupported={pipSupported}
        pipOpen={pipOpen}
        onOpenPip={() => openPip(280, 290)}
        onClosePip={closePip}
      />

      {pipWindow && (
        <PipPanel
          pipWindow={pipWindow}
          task={currentTask}
          sessionName={session.name}
          sequence={session.votingSequence}
          customSequence={session.customSequence}
          selectedVote={myVote}
          revealed={isRevealed}
          totalVotes={totalVotes}
          totalParticipants={totalParticipants}
          participants={participants}
          createdAt={session.createdAt}
          onVote={handleVote}
          onReveal={() => currentTask && revealVotes(id, currentTask.id)}
          onClose={closePip}
        />
      )}

      <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <SessionInfo
            sessionName={session.name}
            sessionId={id}
            createdAt={session.createdAt}
          />
          <Card className="shadow-none border">
            <CardHeader className="px-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {t('participants')} · {totalParticipants}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
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

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          <VotingArea
            sessionId={id}
            session={session}
            currentTask={currentTask}
            userId={userId}
            canControl={canControl}
            participants={participants}
            totalParticipants={totalParticipants}
            myVote={myVote}
            onVote={handleVote}
            onClearVotes={handleClearVotes}
          />

          {!session.freeMode && (
            <Card className="shadow-none border">
              <CardHeader className="px-4">
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
          )}
        </div>
      </div>
    </div>
  );
}
