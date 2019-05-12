import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import machine from '../machine';

describe('machine#CREATE_PASSWORD state', () => {
  const siteId = random.uuid();
  const noteId = random.uuid();
  const note = {
    id: noteId,
    label: random.word(),
  };
  const notes = [note];
  const context = {
    id: siteId,
    encrypted: null,
    password: null,
    notes,
    currentId: note.id,
    prevState: 'NEW',
  };

  it('moves to NEW on CANCEL if prevState is equal NEW', (done) => {
    const CreatePassword = State.create({
      value: { CREATE_PASSWORD: 'idle' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches(context.prevState)) {
          done();
        }
      })
      .start(CreatePassword)
      .send('CANCEL');
  });

  it('moves to SAVING on CREATE if password exists', (done) => {
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

  it('moves from { CREATE_PASSWORD: error } to NEW on CANCEL if prevState is equal NEW', (done) => {
    const CreatePassword = State.create({
      value: { CREATE_PASSWORD: 'error' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches(context.prevState)) {
          done();
        }
      })
      .start(CreatePassword)
      .send('CANCEL');
  });

  it('moves from { CREATE_PASSWORD: error } to SAVING on CREATE if password exists', (done) => {
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
