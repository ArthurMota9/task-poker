import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { getDb, getAuthInstance } from './firebase';
import { Session, VotingSequence } from '@/types';
import { calculateAverage } from './sequences';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);

export async function getOrCreateAnonymousUser(): Promise<string> {
  const auth = getAuthInstance();
  if (auth.currentUser) return auth.currentUser.uid;
  const credential = await signInAnonymously(auth);
  return credential.user.uid;
}

export async function createSession(
  sessionName: string,
  hostName: string,
  votingSequence: VotingSequence,
  anyoneCanControl = false,
  freeMode = false,
): Promise<string> {
  const db = getDb();
  const userId = await getOrCreateAnonymousUser();
  const sessionId = nanoid();

  const initialTaskId = freeMode ? nanoid() : null;

  await setDoc(doc(db, 'sessions', sessionId), {
    id: sessionId,
    name: sessionName,
    hostId: userId,
    status: freeMode ? 'voting' : 'waiting',
    votingSequence,
    anyoneCanControl,
    freeMode,
    currentTaskId: initialTaskId,
    createdAt: Date.now(),
    participants: {
      [userId]: {
        id: userId,
        name: hostName,
        isHost: true,
        joinedAt: Date.now(),
        online: true,
      },
    },
    tasks: freeMode && initialTaskId ? {
      [initialTaskId]: {
        id: initialTaskId,
        title: '',
        status: 'voting',
        average: null,
        votes: {},
        createdAt: Date.now(),
      },
    } : {},
    history: {},
  });

  return sessionId;
}

export async function joinSession(sessionId: string, participantName: string): Promise<string> {
  const db = getDb();
  const userId = await getOrCreateAnonymousUser();
  const sessionRef = doc(db, 'sessions', sessionId);

  const snap = await getDoc(sessionRef);
  if (!snap.exists()) throw new Error('Sessão não encontrada');

  const session = snap.data() as Session;
  const isHost = session.hostId === userId;

  await updateDoc(sessionRef, {
    [`participants.${userId}`]: {
      id: userId,
      name: participantName,
      isHost,
      joinedAt: Date.now(),
      online: true,
    },
  });

  return userId;
}

export async function addTask(sessionId: string, title: string): Promise<string> {
  const db = getDb();
  const taskId = nanoid();
  const sessionRef = doc(db, 'sessions', sessionId);

  await updateDoc(sessionRef, {
    [`tasks.${taskId}`]: {
      id: taskId,
      title,
      status: 'pending',
      average: null,
      votes: {},
      createdAt: Date.now(),
    },
  });

  return taskId;
}

export async function startVoting(sessionId: string, taskId: string): Promise<void> {
  const db = getDb();
  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    currentTaskId: taskId,
    status: 'voting',
    [`tasks.${taskId}.status`]: 'voting',
    [`tasks.${taskId}.votes`]: {},
  });
}

export async function castVote(sessionId: string, taskId: string, userId: string, value: string): Promise<void> {
  const db = getDb();
  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    [`tasks.${taskId}.votes.${userId}`]: {
      value,
      votedAt: Date.now(),
    },
  });
}

export async function revealVotes(sessionId: string, taskId: string): Promise<void> {
  const db = getDb();
  const sessionRef = doc(db, 'sessions', sessionId);
  const snap = await getDoc(sessionRef);
  const session = snap.data() as Session;
  const task = session.tasks[taskId];

  const average = calculateAverage(task.votes);

  await updateDoc(sessionRef, {
    status: 'revealed',
    [`tasks.${taskId}.status`]: 'revealed',
    [`tasks.${taskId}.average`]: average,
  });
}

export async function finishTask(sessionId: string, taskId: string): Promise<void> {
  const db = getDb();
  const sessionRef = doc(db, 'sessions', sessionId);
  const snap = await getDoc(sessionRef);
  const session = snap.data() as Session;
  const task = session.tasks[taskId];
  const participants = session.participants;

  const votesWithNames: Record<string, { name: string; value: string }> = {};
  Object.entries(task.votes).forEach(([uid, vote]) => {
    votesWithNames[uid] = {
      name: participants[uid]?.name ?? 'Desconhecido',
      value: vote.value,
    };
  });

  const finalAverage = calculateAverage(task.votes);

  await updateDoc(sessionRef, {
    currentTaskId: null,
    status: 'waiting',
    [`tasks.${taskId}.status`]: 'done',
    [`tasks.${taskId}.average`]: finalAverage,
    [`history.${taskId}`]: {
      id: taskId,
      title: task.title,
      average: finalAverage,
      votes: votesWithNames,
      completedAt: Date.now(),
    },
  });
}

export async function finishFreeRound(sessionId: string, taskId: string): Promise<void> {
  const db = getDb();
  const sessionRef = doc(db, 'sessions', sessionId);
  const snap = await getDoc(sessionRef);
  const session = snap.data() as Session;
  const task = session.tasks[taskId];
  const participants = session.participants;
  const roundNumber = Object.keys(session.history ?? {}).length + 1;
  const historyId = nanoid();
  const finalAverage = calculateAverage(task.votes);

  const votesWithNames: Record<string, { name: string; value: string }> = {};
  Object.entries(task.votes).forEach(([uid, vote]) => {
    votesWithNames[uid] = {
      name: participants[uid]?.name ?? 'Desconhecido',
      value: vote.value,
    };
  });

  const newTaskId = nanoid();

  await updateDoc(sessionRef, {
    currentTaskId: newTaskId,
    status: 'voting',
    [`tasks.${newTaskId}`]: {
      id: newTaskId,
      title: '',
      status: 'voting',
      average: null,
      votes: {},
      createdAt: Date.now(),
    },
    [`history.${historyId}`]: {
      id: historyId,
      title: '',
      roundNumber,
      average: finalAverage,
      votes: votesWithNames,
      completedAt: Date.now(),
    },
  });
}

export async function clearVotes(sessionId: string, taskId: string): Promise<void> {
  const db = getDb();
  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    status: 'voting',
    [`tasks.${taskId}.votes`]: {},
    [`tasks.${taskId}.status`]: 'voting',
    [`tasks.${taskId}.average`]: null,
  });
}

export function subscribeToSession(sessionId: string, callback: (session: Session | null) => void) {
  const db = getDb();
  const sessionRef = doc(db, 'sessions', sessionId);
  return onSnapshot(sessionRef, (snap) => {
    callback(snap.exists() ? (snap.data() as Session) : null);
  });
}

