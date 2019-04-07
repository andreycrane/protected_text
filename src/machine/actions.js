// @flow

import {
  ContentState,
  convertToRaw,
} from 'draft-js';

import {
  genId,
  getPreferredNeighbor,
} from '../lib';


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


export function createEmptyAction(ctx) {
  const newNote = getNewNote([]);

  return ({
    ...ctx,
    notes: [newNote],
    currentId: newNote.id,
  });
}


export function createFromDecryptedAction(ctx, event) {
  const { data } = event;
  const { notes, password } = data;

  if (Array.isArray(notes) === false || notes.length === 0) {
    const newNote = getNewNote([]);
    return ({
      ...ctx,
      notes: [newNote],
      currentId: newNote.id,
      password,
    });
  }

  return ({
    ...ctx,
    notes,
    currentId: notes[0].id,
    password,
  });
}


export function newNoteAction(ctx) {
  const { notes } = ctx;
  const newNote = getNewNote(notes);

  return ({
    ...ctx,
    currentId: newNote.id,
    notes: [...notes, newNote],
  });
}


export function removeNoteAction(ctx, { id }) {
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

export function updateNoteAction(ctx, { note }) {
  const { notes } = ctx;
  const newNotes: TNotes = notes.map((n): TNote => {
    if (n.id === note.id) {
      return note;
    }

    return n;
  });

  return {
    ...ctx,
    notes: newNotes,
  };
}

export function changeCurrentAction(ctx, { newId }) {
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

export function closeAction() {}

export function idleEntryAction() {}
