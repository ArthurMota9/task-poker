'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomSequenceEditorProps {
  values: string[];
  onChange: (values: string[]) => void;
}

export function CustomSequenceEditor({ values, onChange }: CustomSequenceEditorProps) {
  const t = useTranslations('home');
  const [input, setInput] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  function add() {
    const trimmed = input.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInput('');
  }

  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function handleDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index: number) {
    const from = dragIndexRef.current;
    if (from === null || from === index) {
      setDragOverIndex(null);
      return;
    }
    const next = [...values];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    onChange(next);
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  return (
    <div className="space-y-2 rounded-md border p-2.5">
      <p className="text-xs text-muted-foreground">{t('create.customHint')}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((val, i) => (
          <div
            key={`${val}-${i}`}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={() => handleDrop(i)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs bg-muted/40 cursor-grab active:cursor-grabbing select-none transition-colors ${dragOverIndex === i ? 'border-primary bg-primary/10' : ''}`}
          >
            <span className="text-muted-foreground text-[10px]">⠿</span>
            <span>{val}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors leading-none"
              aria-label={`Remover ${val}`}
            >
              ×
            </button>
          </div>
        ))}
        {values.length === 0 && (
          <p className="text-xs text-muted-foreground italic">{t('create.customEmpty')}</p>
        )}
      </div>
      <div className="flex gap-1.5">
        <Input
          placeholder={t('create.customPlaceholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          className="h-7 text-xs"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={add}
          disabled={!input.trim() || values.includes(input.trim())}
          className="h-7 text-xs px-2.5 shrink-0"
        >
          {t('create.customAdd')}
        </Button>
      </div>
    </div>
  );
}
