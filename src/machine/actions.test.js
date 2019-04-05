import { helpers, random, lorem } from 'faker';

import {
  newNoteAction,
  removeNoteAction,
  changeCurrentAction,
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
      expect(newCtx).toStrictEqual(oldCtx);
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

      const newCtx = removeNoteAction(oldCtx, { type: 'REMOVE_NOTE', payload: { id: currentId } });
      expect(newCtx).toHaveProperty('currentId', preferred.id);
    });
  });

  describe('changeCurrentAction', () => {
    it('returns same context if newId equal currentId', () => {
      const newId = random.uuid();
      const oldCtx = {
        currentId: newId,
      };
      const newCtx = changeCurrentAction(oldCtx, { type: 'CHANGE_CURRENT', payload: { newId } });
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
      const newCtx = changeCurrentAction(oldCtx, { type: 'CHANGE_CURRENT', payload: { newId } });
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
      const newCtx = changeCurrentAction(oldCtx, { type: 'CHANGE_CURRENT', payload: { newId } });
      expect(newCtx).toMatchObject({ currentId: newId });
    });
  });
});
