// @flow

import {
  ContentState,
  convertToRaw,
} from 'draft-js';

import {
  genId,
  getPreferredNeighbor,
} from '../lib';

export function decrypt(ctx) {
  return ({
    ...ctx,
    notes: [],
  });
}

export function createEmpty(ctx) {
  return ({
    ...ctx,
    notes: [],
  });
}

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

export function newNoteAction(ctx) {
  const { notes } = ctx;
  const newNote = getNewNote(notes);

  return {
    ...ctx,
    currentId: newNote.id,
    notes: [...notes, newNote],
  };
}

export function removeNoteAction(ctx, { payload: { id } }) {
  const { notes, currentId } = ctx;
  const removeNote = notes.find((n: TNote): boolean => n.id === id);

  if (!removeNote) {
    return ctx;
  }

  if (notes.length === 1) {
    const newNote = getNewNote(notes);

    return {
      ...ctx,
      currentId: newNote.id,
      notes: [newNote],
    };
  }

  if (currentId === removeNote.id) {
    const preferred = getPreferredNeighbor(notes, removeNote);

    if (preferred) {
      return {
        ...ctx,
        notes: notes.filter((n: TNote): boolean => n.id !== removeNote.id),
        currentId: preferred.id,
      };
    }
  }

  return {
    ...ctx,
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

export function changeCurrentAction(ctx, { payload: { newId } }) {
  const { notes, currentId } = ctx;

  if (currentId === newId) {
    return ctx;
  }

  const newCurrent = notes.find((n: TNote): boolean => n.id === newId);
  if (!newCurrent) {
    return ctx;
  }

  return {
    ...ctx,
    currentId: newId,
  };
}

export function close() {}

export function idleEntry() {}
