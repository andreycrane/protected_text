import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../../lib';
import machine from '../machine';

describe('machine#MODIFIED state', () => {
  const siteId = random.uuid();
  const noteId = random.uuid();
  const note = {
    id: noteId,
    label: random.word(),
  };
  const notes = [note];
  const password = internet.password();
  const encrypted = encrypt(notes, password);
  const context = {
    id: siteId,
    encrypted,
    password,
    notes,
    currentId: noteId,
    prevState: null,
  };

  it('moves to MODIFIED on NEW_NOTE', (done) => {
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('MODIFIED')) {
          done();
        }
      })
      .start(ModifiedState)
      .send('NEW_NOTE');
  });

  it('moves to MODIFIED on REMOVE_NOTE', (done) => {
    const id = random.uuid();
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('MODIFIED')) {
          done();
        }
      })
      .start(ModifiedState)
      .send({ type: 'NEW_NOTE', id });
  });

  it('moves to MODIFIED on UPDATE_NOTE', (done) => {
    const ModifiedState = State.create({
      value: 'MODIFIED',
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
      .start(ModifiedState)
      .send({ type: 'UPDATE_NOTE', note: updatedNote });
  });

  it('stays on MODIFIED on CHANGE_CURRENT', (done) => {
    const newId = random.uuid();
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('MODIFIED')) {
          done();
        }
      })
      .start(ModifiedState)
      .send({ type: 'CHANGE_CURRENT', newId });
  });

  it('moves to CREATE_PASSWORD on SAVE if password doesn\'t exist', (done) => {
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context: {
        ...context,
        password: null,
      },
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('CREATE_PASSWORD')) {
          expect(state.context).toMatchObject({
            ...context,
            password: null,
            prevState: 'MODIFIED',
          });
          done();
        }
      })
      .start(ModifiedState)
      .send('SAVE');
  });

  it('moves to SAVING on SAVE if password exists', (done) => {
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('SAVING')) {
          expect(state.context).toMatchObject({
            ...context,
            prevState: 'MODIFIED',
          });
          done();
        }
      })
      .start(ModifiedState)
      .send('SAVE');
  });

  it('moves to CHANGE_PASSWORD on CHANGE_PASSWORD if password exists', (done) => {
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('CHANGE_PASSWORD')) {
          expect(state.context).toMatchObject({
            ...context,
            prevState: 'MODIFIED',
          });
          done();
        }
      })
      .start(ModifiedState)
      .send('CHANGE_PASSWORD');
  });

  it('moves to DELETING on DELETE', (done) => {
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('DELETING')) {
          expect(state.context).toMatchObject({
            ...context,
            prevState: 'MODIFIED',
          });
          done();
        }
      })
      .start(ModifiedState)
      .send('DELETE');
  });
});
