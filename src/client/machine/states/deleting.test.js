import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../../lib';

import machine from '../machine';
import config from '../config';

describe('machine#DELETING state', () => {
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
  const deleteSite = jest.fn(async () => true);

  const testMachine = machine.withConfig({
    ...config,
    services: {
      deleteSite,
    },
  });

  it('moves to DELETING:confirm children state', (done) => {
    const DeletingState = State.create({
      value: 'DELETING',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches({ DELETING: 'confirm' })) {
          done();
        }
      })
      .start(DeletingState);
  });

  [
    { prevState: 'MODIFIED', expectedState: 'MODIFIED' },
    { prevState: 'SAVED', expectedState: 'SAVED' },
    { prevState: null, expectedState: 'MODIFIED' },
  ].forEach(({ prevState, expectedState }) => {
    it(`moves from DELETING:confirm to ${expectedState} on CANCEL if prevState is equal ${prevState}`, (done) => {
      const DeletingState = State.create({
        value: { DELETING: 'confirm' },
        context: {
          ...context,
          prevState,
        },
      });

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches(expectedState)) {
            done();
          }
        })
        .start(DeletingState)
        .send('CANCEL');
    });
  });

  it('moves from DELETING:confirm to DELETING:deleting on OK', (done) => {
    const DeletingState = State.create({
      value: { DELETING: 'confirm' },
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ DELETING: 'deleting' })) {
          done();
        }
      })
      .start(DeletingState)
      .send('OK');
  });

  it('moves from DELETING:deleting to EXIT if service resolves', (done) => {
    const DeletingState = State.create({
      value: 'DELETING',
      context,
    });

    deleteSite.mockImplementation(async () => true);

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches('EXIT')) {
          done();
        }
      })
      .start(DeletingState)
      .send('OK');
  });

  it('moves from DELETING:deleting to DELETING:error if service rejects', (done) => {
    const DeletingState = State.create({
      value: 'DELETING',
      context,
    });

    deleteSite.mockImplementation(async () => { throw new Error(); });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ DELETING: 'error' })) {
          done();
        }
      })
      .start(DeletingState)
      .send('OK');
  });

  it('moves from DELETING:error to DELETING:deleting on REPEAT', (done) => {
    const DeletingState = State.create({
      value: { DELETING: 'error' },
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ DELETING: 'deleting' })) {
          done();
        }
      })
      .start(DeletingState)
      .send('REPEAT');
  });


  [
    { prevState: 'MODIFIED', expectedState: 'MODIFIED' },
    { prevState: 'SAVED', expectedState: 'SAVED' },
    { prevState: null, expectedState: 'MODIFIED' },
  ].forEach(({ prevState, expectedState }) => {
    it(`moves from DELETING:error to ${expectedState} on CANCEL if prevState is equal ${prevState}`, (done) => {
      const DeletingState = State.create({
        value: { DELETING: 'error' },
        context: {
          ...context,
          prevState,
        },
      });

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches(expectedState)) {
            done();
          }
        })
        .start(DeletingState)
        .send('CANCEL');
    });
  });
});
