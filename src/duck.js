// @flow

import { ContentState, convertToRaw } from 'draft-js';

import { genId, getPreferredNeighbor } from './lib';
import type { TNotes, TNote } from './types';

export type TState = $ReadOnly<{
  notes: TNotes,
  currentId: string,
}>;


export type TAction =
  $ReadOnly<{ type: 'NEW_NOTE' }> |
  $ReadOnly<{ type: 'UPDATE_NOTE', note: TNote }> |
  $ReadOnly<{ type: 'REMOVE_NOTE', id: string }> |
  $ReadOnly<{ type: 'CHANGE_CURRENT', newId: string }>;


export function getNewNote(notes: TNotes): TNote {
  const newLabel = `Note ${notes.length + 1}`;
  const newNote = {
    id: genId(),
    label: `Note ${notes.length + 1}`,
    rawContent: convertToRaw(
      ContentState.createFromText(newLabel),
    ),
  };

  return newNote;
}

export function newNoteOp(state: TState): TState {
  const { notes } = state;
  const newNote = getNewNote(notes);

  return {
    currentId: newNote.id,
    notes: [...notes, newNote],
  };
}

export function removeNoteOp(state: TState, removeId: string): TState {
  const { notes, currentId } = state;
  const removeNote = notes.find((n: TNote): boolean => n.id === removeId);

  if (!removeNote) {
    return state;
  }

  if (notes.length === 1) {
    const newNote = getNewNote(notes);

    return {
      currentId: newNote.id,
      notes: [newNote],
    };
  }

  if (currentId === removeNote.id) {
    const preferred = getPreferredNeighbor(notes, removeNote);

    if (preferred) {
      return {
        notes: notes.filter((n: TNote): boolean => n.id !== removeNote.id),
        currentId: preferred.id,
      };
    }
  }

  return {
    ...state,
    notes: notes.filter((n: TNote): boolean => n.id !== removeNote.id),
  };
}

export function updateNoteOp(state: TState, note: TNote): TState {
  const { notes } = state;
  const newNotes: TNotes = notes.map((n): TNote => {
    if (n.id === note.id) {
      return note;
    }

    return n;
  });

  return {
    ...state,
    notes: newNotes,
  };
}

export function changeCurrentOp(state: TState, newId: string): TState {
  const { notes, currentId } = state;

  if (currentId === newId) {
    return state;
  }

  const newCurrent = notes.find((n: TNote): boolean => n.id === newId);
  if (!newCurrent) {
    return state;
  }

  return {
    ...state,
    currentId: newId,
  };
}

export function initState(initialNotes: TNotes): TState {
  return {
    notes: initialNotes,
    currentId: initialNotes[0].id,
  };
}

export default function reducer(state: TState, action: TAction): TState {
  switch (action.type) {
    case 'NEW_NOTE':
      return newNoteOp(state);
    case 'UPDATE_NOTE':
      return updateNoteOp(state, action.note);
    case 'REMOVE_NOTE':
      return removeNoteOp(state, action.id);
    case 'CHANGE_CURRENT':
      return changeCurrentOp(state, action.newId);
    default:
      return state;
  }
}
