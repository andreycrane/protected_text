import {
  internet,
  helpers,
  random,
  lorem,
} from 'faker';

import {
  newNoteAction,
  removeNoteAction,
  changeCurrentAction,
  updateNoteAction,
  createEmptyAction,
  createFromDecryptedAction,
} from './actions';
import { getPreferredNeighbor } from '../lib';

describe('machine#actions', () => {
  describe('newNoteAction', () => {
    it('creates new note', () => {
      const oldCtx = {
        currentId: null,
        notes: [],
      };

      const newCtx = newNoteAction(oldCtx);
      expect(newCtx).toHaveProperty('notes.length', oldCtx.notes.length + 1);
    });

    it('sets currentId to new note id', () => {
      const oldCtx = {
        currentId: null,
        notes: [],
      };

      const newCtx = newNoteAction(oldCtx);
      expect(newCtx).toHaveProperty('currentId', newCtx.notes[newCtx.notes.length - 1].id);
    });
  });

  describe('removeNoteAction', () => {
    it('removes existing note', () => {
      const id = random.uuid();
      const firstNote = { id, label: lorem.word() };
      const secondNote = { id: random.uuid(), label: lorem.word() };
      const notes = [firstNote, secondNote];

      const oldCtx = { notes };
      const newCtx = removeNoteAction(oldCtx, { type: 'REMOVE_NOTE', id });

      expect(newCtx).toHaveProperty('notes.length', oldCtx.notes.length - 1);
      expect(newCtx.note).toEqual(
        expect.not.arrayContaining([firstNote]),
      );
    });

    it('returns same context if note doesn\'t exist', () => {
      const id = random.uuid();
      const oldCtx = {
        notes: [
          { id: random.uuid(), label: lorem.word() },
          { id: random.uuid(), label: lorem.word() },
        ],
      };

      const newCtx = removeNoteAction(oldCtx, { type: 'REMOVE_NOTE', id });
      expect(newCtx).toStrictEqual(oldCtx);
    });

    it('creates new note if last note was removed', () => {
      const id = random.uuid();
      const oldNote = { id, label: lorem.word() };
      const oldCtx = {
        currentId: null,
        notes: [oldNote],
      };

      const newCtx = removeNoteAction(oldCtx, { type: 'REMOVE_NOTE', id });
      expect(newCtx).toHaveProperty('notes.length', 1);
      expect(newCtx.note).toEqual(
        expect.not.arrayContaining([oldNote]),
      );
      expect(newCtx).toHaveProperty('currentId', newCtx.notes[0].id);
    });

    it('moves currentId to preferred neighbor of removed note', () => {
      const currentId = random.uuid();
      const removeNote = { id: currentId, label: lorem.word() };
      const notes = helpers.shuffle([
        removeNote,
        { id: random.uuid(), label: lorem.word() },
        { id: random.uuid(), label: lorem.word() },
      ]);
      const oldCtx = {
        currentId,
        notes,
      };
      const preferred = getPreferredNeighbor(notes, removeNote);

      const newCtx = removeNoteAction(oldCtx, { type: 'REMOVE_NOTE', id: currentId });
      expect(newCtx).toHaveProperty('currentId', preferred.id);
    });
  });

  describe('changeCurrentAction', () => {
    it('returns same context if newId equal currentId', () => {
      const newId = random.uuid();
      const oldCtx = {
        currentId: newId,
      };
      const newCtx = changeCurrentAction(oldCtx, { type: 'CHANGE_CURRENT', newId });
      expect(newCtx).toStrictEqual(oldCtx);
    });

    it('returns same context if newId doesn\'t exist', () => {
      const newId = random.uuid();
      const notes = [
        { id: random.uuid() },
        { id: random.uuid() },
        { id: random.uuid() },
        { id: random.uuid() },
      ];
      const oldCtx = {
        currentId: notes[0].id,
        notes,
      };
      const newCtx = changeCurrentAction(oldCtx, { type: 'CHANGE_CURRENT', newId });
      expect(newCtx).toStrictEqual(oldCtx);
    });

    it('sets currentId to newId', () => {
      const newId = random.uuid();
      const currentId = random.uuid();
      const notes = helpers.shuffle([
        { id: newId },
        { id: currentId },
        { id: random.uuid() },
        { id: random.uuid() },
      ]);
      const oldCtx = {
        currentId,
        notes,
      };
      const newCtx = changeCurrentAction(oldCtx, { type: 'CHANGE_CURRENT', newId });
      expect(newCtx).toMatchObject({ currentId: newId });
    });
  });

  describe('updateNoteAction', () => {
    it('returns same context if updating note doesn\'t exists', () => {
      const oldCtx = {
        notes: [{ id: random.uuid(), label: lorem.word() }],
      };
      const note = { id: random.uuid(), label: lorem.word() };
      const newCtx = updateNoteAction(oldCtx, { type: 'UPDATE_NOTE', note });

      expect(newCtx).toStrictEqual(oldCtx);
    });

    it('updates existing note', () => {
      const id = random.uuid();
      const oldCtx = {
        notes: [{ id, label: lorem.word() }],
      };
      const note = { id, label: lorem.word() };
      const newCtx = updateNoteAction(oldCtx, { type: 'UPDATE_NOTE', note });

      expect(newCtx.notes).toEqual(
        expect.arrayContaining([note]),
      );
    });
  });

  describe('createEmptyAction', () => {
    it('creates notes array and pushes default note', () => {
      const oldCtx = { [random.objectElement()]: random.word() };

      const newCtx = createEmptyAction(oldCtx, { type: 'CREATE_EMPTY' });

      expect(newCtx).toMatchObject(oldCtx);
      expect(newCtx).toHaveProperty('notes');
      expect(newCtx.notes).toHaveLength(1);
      expect(newCtx).toHaveProperty('currentId', newCtx.notes[0].id);
    });
  });

  describe('createFromDecryptedAction', () => {
    it('creates notes array from encrypted content', () => {
      const oldCtx = { encrypted: random.words() };
      const notes = [{ id: random.uuid(), label: random.word() }];
      const password = internet.password();
      const event = {
        data: {
          notes,
          password,
        },
      };

      const newCtx = createFromDecryptedAction(oldCtx, event);

      expect(newCtx).toMatchObject(oldCtx);
      expect(newCtx).toHaveProperty('notes');
      expect(newCtx.notes).toHaveLength(notes.length);
      expect(newCtx).toHaveProperty('currentId', newCtx.notes[0].id);
      expect(newCtx).toHaveProperty('password', password);
    });

    it('creates notes array from empty encrypted content', () => {
      const oldCtx = { encrypted: random.words() };
      const notes = [];
      const password = internet.password();
      const event = {
        data: {
          notes,
          password,
        },
      };

      const newCtx = createFromDecryptedAction(oldCtx, event);

      expect(newCtx).toMatchObject(oldCtx);
      expect(newCtx).toHaveProperty('notes');
      expect(newCtx.notes).toHaveLength(1);
      expect(newCtx).toHaveProperty('currentId', newCtx.notes[0].id);
      expect(newCtx).toHaveProperty('password', password);
    });
  });
});
