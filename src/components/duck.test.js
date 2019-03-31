import reducer, { initState } from './duck';

describe('duck', () => {
  it('creates new note', () => {
    const oldState = initState([]);

    const newState = reducer(oldState, { type: 'NEW_NOTE' });

    expect(newState).toHaveProperty('notes.length', oldState.notes.length + 1);
    expect(newState).toHaveProperty('currentId', newState.notes[newState.notes.length - 1].id);
  });
});
