'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskManagerProps {
  tasks: Record<string, Task>;
  currentTaskId: string | null;
  isHost: boolean;
  onAddTask: (title: string) => void;
  onStartVoting: (taskId: string) => void;
}

export function TaskManager({ tasks, currentTaskId, isHost, onAddTask, onStartVoting }: TaskManagerProps) {
  const t = useTranslations('taskManager');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const taskList = Object.values(tasks).sort((a, b) => a.createdAt - b.createdAt);
  const pendingTasks = taskList.filter((t) => t.status === 'pending');

  const handleAdd = () => {
    onAddTask(newTaskTitle.trim());
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-2">
      {isHost && (
        <div className="flex gap-2">
          <Input
            placeholder={t('placeholder')}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="text-sm"
          />
          <Button size="sm" onClick={handleAdd}>{t('add')}</Button>
        </div>
      )}

      {pendingTasks.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {isHost ? t('emptyHost') : t('emptyGuest')}
        </p>
      )}

      {pendingTasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            'flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors',
            currentTaskId === task.id ? 'border-primary/30 bg-accent' : 'border-border bg-card'
          )}
        >
          <span className={cn('truncate', !task.title && 'text-muted-foreground italic text-xs')}>
            {task.title || t('untitled')}
          </span>
          {isHost && currentTaskId !== task.id && (
            <Button size="sm" variant="ghost" className="text-xs h-6 px-2 ml-2 shrink-0" onClick={() => onStartVoting(task.id)}>
              {t('vote')}
            </Button>
          )}
          {currentTaskId === task.id && (
            <Badge className="text-xs ml-2 shrink-0">{t('voting')}</Badge>
          )}
        </div>
      ))}
    </div>
  );
}
