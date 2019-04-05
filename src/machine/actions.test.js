import { random, lorem } from 'faker';

import {
  newNoteAction,
  removeNoteAction,
} from './actions';

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
      const newCtx = removeNoteAction(oldCtx, { type: 'REMOVE_NOTE', payload: { id } });

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

      const newCtx = removeNoteAction(oldCtx, { type: 'REMOVE_NOTE', payload: { id } });
      expect(newCtx).toEqual(oldCtx);
    });

    it('creates new note if last note was removed', () => {
      const id = random.uuid();
      const oldNote = { id, label: lorem.word() };
      const oldCtx = {
        currentId: null,
        notes: [oldNote],
      };

      const newCtx = removeNoteAction(oldCtx, { type: 'REMOVE_NOTE', payload: { id } });
      expect(newCtx).toHaveProperty('notes.length', 1);
      expect(newCtx.note).toEqual(
        expect.not.arrayContaining([oldNote]),
      );
      expect(newCtx).toHaveProperty('currentId', newCtx.notes[0].id);
    });
  });
});
