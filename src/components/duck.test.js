import { random, lorem } from 'faker';

import reducer, { initState } from './duck';

describe('duck', () => {
  it('creates new note', () => {
    const oldState = initState([]);

    const newState = reducer(oldState, { type: 'NEW_NOTE' });

    expect(newState).toHaveProperty('notes.length', oldState.notes.length + 1);
    expect(newState).toHaveProperty('currentId', newState.notes[newState.notes.length - 1].id);
  });

  it('removes existing note', () => {
    const id = random.uuid();
    const firstNote = { id, label: lorem.word() };
    const secondNote = { id: random.uuid(), label: lorem.word() };
    const initialNotes = [firstNote, secondNote];

    const oldState = initState(initialNotes);
    const newState = reducer(oldState, { type: 'REMOVE_NOTE', id });

    expect(newState).toHaveProperty('notes.length', oldState.notes.length - 1);
    expect(newState.note).toEqual(
      expect.not.arrayContaining([firstNote]),
    );
  });
});
