import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import machine from '../machine';

describe('machine#CREATE_PASSWORD state', () => {
  it('moves to MODIFIED on CANCEL', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const CreatePassword = State.create({
      value: { CREATE_PASSWORD: 'idle' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('MODIFIED')) {
          done();
        }
      })
      .start(CreatePassword)
      .send('CANCEL');
  });

  it('moves to SAVING on CREATE if password exists', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const CreatePassword = State.create({
      value: { CREATE_PASSWORD: 'idle' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('SAVING')) {
          done();
        }
      })
      .start(CreatePassword)
      .send({ type: 'CREATE', password: internet.password() });
  });

  it('moves to { CREATE_PASSWORD: error } on CREATE if password doesn\'t exist', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const CreatePassword = State.create({
      value: { CREATE_PASSWORD: 'idle' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches({ CREATE_PASSWORD: 'error' })) {
          done();
        }
      })
      .start(CreatePassword)
      .send({ type: 'CREATE', password: null });
  });

  it('moves from { CREATE_PASSWORD: error } to MODIFIED on CANCEL', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const CreatePassword = State.create({
      value: { CREATE_PASSWORD: 'error' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('MODIFIED')) {
          done();
        }
      })
      .start(CreatePassword)
      .send('CANCEL');
  });

  it('moves from { CREATE_PASSWORD: error } to SAVING on CREATE if password exists', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const password = internet.password();
    const CreatePassword = State.create({
      value: { CREATE_PASSWORD: 'error' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('SAVING')) {
          done();
        }
      })
      .start(CreatePassword)
      .send({ type: 'CREATE', password });
  });

  it('moves from { CREATE_PASSWORD: error } to itself on CREATE if password doesn\'t exist', (done) => {
    const context = {
      password: null,
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const CreatePassword = State.create({
      value: { CREATE_PASSWORD: 'error' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches({ CREATE_PASSWORD: 'error' })) {
          done();
        }
      })
      .start(CreatePassword)
      .send({ type: 'CREATE' });
  });
});
