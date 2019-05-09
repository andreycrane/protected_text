import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import machine from '../machine';

describe('machine#MODIFIED state', () => {
  it('moves to MODIFIED on NEW_NOTE', (done) => {
    const context = {
      notes: [],
    };
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
    const context = {
      notes: [{ id, label: random.words() }],
    };
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
    const id = random.uuid();
    const note = { id, label: random.words() };
    const context = {
      notes: [note],
    };
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
    const oldId = random.uuid();
    const newId = random.uuid();
    const context = {
      notes: [
        { id: oldId, label: random.words() },
        { id: newId, label: random.words() },
      ],
      currentId: oldId,
    };
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
    const context = {
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('CREATE_PASSWORD')) {
          done();
        }
      })
      .start(ModifiedState)
      .send('SAVE');
  });

  it('moves to SAVING on SAVE if password exists', (done) => {
    const context = {
      password: internet.password(),
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('SAVING')) {
          done();
        }
      })
      .start(ModifiedState)
      .send('SAVE');
  });

  it('moves to CHANGE_PASSWORD on CHANGE_PASSWORD if password exists', (done) => {
    const context = {
      password: internet.password(),
      notes: [
        { id: random.uuid(), label: random.words() },
        { id: random.uuid(), label: random.words() },
      ],
      currentId: random.uuid(),
    };
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.changed === true && state.matches('CHANGE_PASSWORD')) {
          done();
        }
      })
      .start(ModifiedState)
      .send('CHANGE_PASSWORD');
  });

  it('moves to DELETING on DELETE', (done) => {
    const id = random.uuid();
    const note = { id, label: random.words() };
    const context = {
      notes: [note],
    };
    const ModifiedState = State.create({
      value: 'MODIFIED',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('DELETING')) {
          done();
        }
      })
      .start(ModifiedState)
      .send('DELETE');
  });
});
