import { interpret } from 'xstate';
import { internet } from 'faker';

import machine from './machine';
import { encrypt } from '../lib';

describe.only('machine', () => {
  const states = {};

  it('moves from INITIAL state to ENCRYPTED state', (done) => {
    const initialContext = {
      encrypted: '{ "some json": "data" }',
    };
    const testMachine = machine.withContext(initialContext);

    interpret(testMachine)
      .onTransition((state) => {
        expect(state.value).toMatchObject({ ENCRYPTED: 'idle' });
        expect(state.context).toMatchObject(initialContext);

        states.ENCRYPTED = state;

        done();
      })
      .start();
  });

  it('moves from INITIAL state to FREE state', (done) => {
    const initialContext = {
      encrypted: null,
    };
    const testMachine = machine.withContext(initialContext);

    interpret(testMachine)
      .onTransition((state) => {
        expect(state.value).toMatch('FREE');
        expect(state.context).toMatchObject(initialContext);

        states.FREE = state;

        done();
      })
      .start();
  });

  it('moves from ENCRYPTED state to IDLE on DECRYPT', (done) => {
    jest.setTimeout(10000);
    const password = internet.password();
    const notes = [];
    const ctx = {
      encrypted: encrypt(notes, password),
    };

    interpret(machine.withContext(ctx))
      .onTransition((state) => {
        if (state.matches('IDLE')) {
          done();
        }
      })
      .start()
      .send({ type: 'DECRYPT', password });
  });

  it('moves from FREE state to IDLE on CREATE_EMPTY', (done) => {
    interpret(machine)
      .start(states.FREE)
      .onTransition((state) => {
        if (state.matches('IDLE')) {
          expect(state.context).toHaveProperty('notes');
          expect(state.context.notes).toHaveLength(1);
          done();
        }
      })
      .send('CREATE_EMPTY');
  });
});
