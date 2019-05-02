// @flow

import {
  ContentState,
  convertToRaw,
} from 'draft-js';

import {
  genId,
  getPreferredNeighbor,
  isObject,
} from '../lib';

export function getNewNote(notes: null | TNotes): TNote {
  const newLabel = Array.isArray(notes) ? `Note ${notes.length + 1}` : 'Note 1';
  const newNote = {
    id: genId(),
    label: newLabel,
    rawContent: convertToRaw(
      ContentState.createFromText(newLabel),
    ),
  };

  return newNote;
}


export function createEmptyAction(ctx: TContext): TContext {
  const newNote = getNewNote([]);

  return ({
    ...ctx,
    notes: [newNote],
    currentId: newNote.id,
  });
}


export function createFromDecryptedAction(ctx: TContext, event: TEvent): TContext {
  const { data } = event;

  if (!isObject(data) || typeof data.password !== 'string') {
    throw new Error('invalid params in event object');
  }

  // eslint-disable-next-line flowtype/no-weak-types
  const { notes, password } = (data: Object);

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


export function newNoteAction(ctx: TContext): TContext {
  const { notes } = ctx;
  const newNote = getNewNote(notes);

  if (Array.isArray(notes)) {
    return ({
      ...ctx,
      currentId: newNote.id,
      notes: [...notes, newNote],
    });
  }

  return ({
    ...ctx,
    currentId: newNote.id,
    notes: [newNote],
  });
}


export function removeNoteAction(ctx: TContext, event: TEvent): TContext {
  if (typeof event.id !== 'string') {
    throw new Error('invalid event params');
  }

  if (!Array.isArray(ctx.notes)) {
    throw new Error('invalid context');
  }

  const { id } = event;
  const { notes, currentId } = ctx;
  const removeNote = notes.find((n: TNote): boolean => n.id === id);

  if (!removeNote) {
    return ctx;
  }

  if (notes.length === 1) {
    const newNote = getNewNote(null);

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

export function updateNoteAction(ctx: TContext, event: TEvent): TContext {
  if (!isObject(event.note)) {
    throw new Error('invalid event params');
  }

  if (!Array.isArray(ctx.notes)) {
    throw new Error('invalid context');
  }

  const { note } = event;
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

export function changeCurrentAction(ctx: TContext, event: TEvent): TContext {
  if (typeof event.newId !== 'string') {
    throw new Error('invalid event params');
  }

  if (!Array.isArray(ctx.notes) || typeof ctx.currentId !== 'string') {
    throw new Error('invalid context');
  }

  const { newId } = event;
  const { notes, currentId } = ctx;

  if (currentId === newId) {
    return ctx;
  }

  const newCurrent = notes.find((n: TNote): boolean => n.id === newId);
  if (!newCurrent) {
    return ctx;
  }

  return ({
    ...ctx,
    currentId: newId,
  });
}

export function setPasswordAction(ctx: TContext, event: TEvent): TContext {
  if (typeof event.password !== 'string') {
    throw new Error('invalid event params');
  }

  return ({
    ...ctx,
    password: event.password,
  });
}

export function closeAction() {}

export function idleEntryAction() {}
