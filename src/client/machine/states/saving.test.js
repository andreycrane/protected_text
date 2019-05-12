import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../../lib';

import machine from '../machine';
import { postSiteService } from '../services';

jest.mock('../services', () => {
  const t = jest.requireActual('../services');
  t.postSiteService = jest.fn(async () => null);

  return t;
});

describe('machine#SAVING state', () => {
  const siteId = random.uuid();
  const password = internet.password();
  const note = {
    id: random.uuid(),
    [random.objectElement()]: random.word(),
  };
  const notes = [note];
  const encrypted = encrypt(notes, password);
  const context = {
    id: siteId,
    encrypted: null,
    password,
    notes,
    currentId: note.id,
  };

  it('moves to SAVING:saving children state', (done) => {
    const testMachine = machine.withContext(context);
    const SavingState = State.create({
      value: 'SAVING',
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ SAVING: 'saving' })) {
          done();
        }
      })
      .start(SavingState);
  });

  it('moves to SAVED if service resolves', (done) => {
    const testMachine = machine.withContext(context);
    testMachine.initial = 'SAVING';

    postSiteService.mockImplementation(async () => ({ id: siteId, encrypted }));

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches('SAVED')) {
          expect(state.context).toMatchObject({
            ...context,
            encrypted,
          });
          done();
        }
      })
      .start();
  });

  it('moves to SAVING.error if service rejects', (done) => {
    const testMachine = machine.withContext(context);
    testMachine.initial = 'SAVING';

    postSiteService.mockImplementation(async () => { throw new Error(); });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ SAVING: 'error' })) {
          expect(state.context).toBe(context);
          done();
        }
      })
      .start();
  });

  it('moves from SAVING.error to SAVING.saving on REPEAT', (done) => {
    const testMachine = machine.withContext(context);
    const SavingState = State.create({
      value: { SAVING: 'error' },
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ SAVING: 'saving' })) {
          done();
        }
      })
      .start(SavingState)
      .send('REPEAT');
  });

  [
    { prevState: 'MODIFIED', expectedState: 'MODIFIED' },
    { prevState: 'NEW', expectedState: 'NEW' },
    { prevState: null, expectedState: 'NEW' },
  ].forEach(({ prevState, expectedState }) => {
    it(`moves from SAVING.error to ${expectedState} on CANCEL if prevState is equal ${prevState}`, (done) => {
      const testMachine = machine.withContext(context);
      const SavingState = State.create({
        value: { SAVING: 'error' },
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
        .start(SavingState)
        .send('CANCEL');
    });
  });
});
