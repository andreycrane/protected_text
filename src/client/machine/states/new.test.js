import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../../lib';

import machine from '../machine';
import initContext from '../context';

describe('machine#NEW state', () => {
  const siteId = random.uuid();
  const noteId = random.uuid();
  const note = {
    id: noteId,
    [random.objectElement()]: random.uuid(),
  };
  const notes = [note];
  const password = internet.password();
  const encrypted = encrypt(notes, password);
  const context = {
    ...initContext(siteId, encrypted),
    password,
    notes,
    currentId: note.id,
  };

  it('moves to itself on NEW_NOTE', (done) => {
    const NewState = State.create({
      value: 'NEW',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('NEW')) {
          const { context: newContext } = state;
          expect(newContext).toMatchObject({
            id: siteId,
            encrypted,
            password,
          });
          expect(newContext).toHaveProperty('notes');
          expect(newContext.notes).toHaveLength(notes.length + 1);
          expect(newContext).toHaveProperty(
            'currentId',
            newContext.notes[newContext.notes.length - 1].id,
          );
          done();
        }
      })
      .start(NewState)
      .send('NEW_NOTE');
  });

  it('moves to CREATE_PASSWORD on SAVE', (done) => {
    const NewState = State.create({
      value: 'NEW',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('CREATE_PASSWORD')) {
          done();
        }
      })
      .start(NewState)
      .send('SAVE');
  });

  it('moves to itself on REMOVE_NOTE', (done) => {
    const id = random.uuid();
    const NewState = State.create({
      value: 'NEW',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('NEW')) {
          done();
        }
      })
      .start(NewState)
      .send({ type: 'NEW_NOTE', id });
  });

  it('moves to itself on UPDATE_NOTE', (done) => {
    const NewState = State.create({
      value: 'NEW',
      context,
    });
    const updatedNote = {
      ...note,
      label: random.words(),
    };

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('NEW')) {
          done();
        }
      })
      .start(NewState)
      .send({ type: 'UPDATE_NOTE', note: updatedNote });
  });

  it('moves to itself on CHANGE_CURRENT', (done) => {
    const oldId = random.uuid();
    const newId = random.uuid();
    const ctx = {
      notes: [
        { id: oldId, label: random.words() },
        { id: newId, label: random.words() },
      ],
      currentId: oldId,
    };
    const NewState = State.create({
      value: 'NEW',
      context: ctx,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('NEW')) {
          done();
        }
      })
      .start(NewState)
      .send({ type: 'CHANGE_CURRENT', newId });
  });
});
