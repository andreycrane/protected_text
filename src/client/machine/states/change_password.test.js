import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../../lib';

import machine from '../machine';

describe('machine#CHANGE_PASSWORD state', () => {
  const siteId = random.uuid();
  const noteId = random.uuid();
  const note = {
    id: noteId,
    label: random.word(),
  };
  const password = internet.password();
  const notes = [note];
  const encrypted = encrypt(notes, password);
  const context = {
    id: siteId,
    encrypted,
    password,
    notes,
    currentId: noteId,
    prevState: null,
  };

  it('moves to MODIFIED on CREATE if password exists', (done) => {
    const ChangePassword = State.create({
      value: { CHANGE_PASSWORD: 'idle' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('MODIFIED')) {
          done();
        }
      })
      .start(ChangePassword)
      .send({ type: 'CREATE', password: internet.password() });
  });

  [
    { prevState: 'MODIFIED', expectedState: 'MODIFIED' },
    { prevState: 'SAVED', expectedState: 'SAVED' },
    { prevState: null, expectedState: 'MODIFIED' },
  ].forEach(({ prevState, expectedState }) => {
    it(`moves from { CHANGE_PASSWORD: idle } to ${expectedState} on CANCEL if prevState is equal ${prevState}`, (done) => {
      const ChangePassword = State.create({
        value: { CHANGE_PASSWORD: 'idle' },
        context: {
          ...context,
          prevState,
        },
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches(expectedState)) {
            done();
          }
        })
        .start(ChangePassword)
        .send('CANCEL');
    });
  });

  it('moves to { CHANGE_PASSWORD: error } on CREATE if password doesn\'t exist', (done) => {
    const ChangePassword = State.create({
      value: { CHANGE_PASSWORD: 'idle' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches({ CHANGE_PASSWORD: 'error' })) {
          done();
        }
      })
      .start(ChangePassword)
      .send({ type: 'CREATE', password: null });
  });

  it('moves from { CHANGE_PASSWORD: error } to MODIFIED on CREATE if password exists', (done) => {
    const ChangePassword = State.create({
      value: { CHANGE_PASSWORD: 'error' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('MODIFIED')) {
          done();
        }
      })
      .start(ChangePassword)
      .send({ type: 'CREATE', password: internet.password() });
  });

  it('moves from { CHANGE_PASSWORD: error } to itself on CREATE if password doesn\'t exist', (done) => {
    const ChangePassword = State.create({
      value: { CHANGE_PASSWORD: 'error' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches({ CHANGE_PASSWORD: 'error' })) {
          done();
        }
      })
      .start(ChangePassword)
      .send({ type: 'CREATE', password: null });
  });

  [
    { prevState: 'MODIFIED', expectedState: 'MODIFIED' },
    { prevState: 'SAVED', expectedState: 'SAVED' },
    { prevState: null, expectedState: 'MODIFIED' },
  ].forEach(({ prevState, expectedState }) => {
    it(`moves from { CHANGE_PASSWORD: error } to ${expectedState} on CANCEL if prevState is equal ${prevState}`, (done) => {
      const ChangePassword = State.create({
        value: { CHANGE_PASSWORD: 'error' },
        context: {
          ...context,
          prevState,
        },
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches(expectedState)) {
            done();
          }
        })
        .start(ChangePassword)
        .send('CANCEL');
    });
  });
});
