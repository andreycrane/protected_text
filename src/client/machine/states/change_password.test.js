import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import machine from '../machine';

describe('machine#CHANGE_PASSWORD state', () => {
  it('moves to MODIFIED on CREATE if password exists', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
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

  it('moves to { CHANGE_PASSWORD: error } on CREATE if password doesn\'t exist', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
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
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
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
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
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

  it('moves from { CHANGE_PASSWORD: error } to MODIFIED on CANCEL', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
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
      .send('CANCEL');
  });
});
