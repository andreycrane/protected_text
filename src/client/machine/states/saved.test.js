import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../../lib';

import machine from '../machine';

describe('machine#SAVED state', () => {
  const siteId = random.uuid();
  const password = internet.password();
  const note = {
    id: random.uuid(),
    [random.objectElement()]: random.words(),
  };
  const notes = [note];
  const encrypted = encrypt(notes, password);
  const context = {
    id: siteId,
    encrypted,
    password,
    notes,
    currentId: note.id,
    prevState: null,
  };

  it('moves to CHANGE_PASSWORD on CHANGE_PASSWORD', (done) => {
    const SavedState = State.create({
      value: 'SAVED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('CHANGE_PASSWORD')) {
          expect(state.context).toMatchObject({
            ...context,
            prevState: 'SAVED',
          });
          done();
        }
      })
      .start(SavedState)
      .send('CHANGE_PASSWORD');
  });

  it('moves to MODIFIED on NEW_NOTE', (done) => {
    const SavedState = State.create({
      value: 'SAVED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('MODIFIED')) {
          done();
        }
      })
      .start(SavedState)
      .send('NEW_NOTE');
  });

  it('moves to MODIFIED on REMOVE_NOTE', (done) => {
    const SavedState = State.create({
      value: 'SAVED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('MODIFIED')) {
          done();
        }
      })
      .start(SavedState)
      .send({ type: 'REMOVE_NOTE', id: note.id });
  });

  it('moves to MODIFIED on UPDATE_NOTE', (done) => {
    const SavedState = State.create({
      value: 'SAVED',
      context,
    });
    const updatedNote = {
      ...note,
      label: random.words(),
    };

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('MODIFIED')) {
          done();
        }
      })
      .start(SavedState)
      .send({ type: 'UPDATE_NOTE', note: updatedNote });
  });

  it('moves to DELETING on DELETE', (done) => {
    const SavedState = State.create({
      value: 'SAVED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('DELETING')) {
          expect(state.context).toMatchObject({
            ...context,
            prevState: 'SAVED',
          });
          done();
        }
      })
      .start(SavedState)
      .send('DELETE');
  });

  it('stays on SAVED on CHANGE_CURRENT', (done) => {
    const SavedState = State.create({
      value: 'SAVED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('SAVED')) {
          done();
        }
      })
      .start(SavedState)
      .send({ type: 'CHANGE_CURRENT', newId: note.id });
  });
});
