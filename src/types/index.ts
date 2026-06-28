export type VotingSequence = 'fibonacci' | 'tshirt' | 'powers_of_2';

export type SessionStatus = 'waiting' | 'voting' | 'revealed';

export type TaskStatus = 'pending' | 'voting' | 'revealed' | 'done';

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
}

export interface Vote {
  value: string;
  votedAt: number;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  average: number | null;
  votes: Record<string, Vote>;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  title: string;
  average: number;
  votes: Record<string, { name: string; value: string }>;
  completedAt: number;
}

export interface Session {
  id: string;
  name: string;
  hostId: string;
  status: SessionStatus;
  votingSequence: VotingSequence;
  anyoneCanControl: boolean;
  currentTaskId: string | null;
  createdAt: number;
  participants: Record<string, Participant>;
  tasks: Record<string, Task>;
  history: Record<string, HistoryEntry>;
}
