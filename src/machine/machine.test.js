import { interpret } from 'xstate';
import machine from './machine';

describe('machine', () => {
  const states = {};

  it('moves from INITIAL state to ENCRYPTED state', (done) => {
    const initialContext = {
      encrypted: '{ "some json": "data" }',
    };
    const testMachine = machine.withContext(initialContext);

    interpret(testMachine)
      .onTransition((state) => {
        expect(state.value).toMatch('ENCRYPTED');
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
    interpret(machine)
      .start(states.ENCRYPTED)
      .onTransition((state) => {
        if (state.matches('IDLE')) {
          expect(state.context).toMatchObject({ notes: [] });
          done();
        }
      })
      .send({ type: 'DECRYPT', payload: { hello: 'world' } });
  });

  it('moves from FREE state to IDLE on CREATE_EMPTY', (done) => {
    interpret(machine)
      .start(states.FREE)
      .onTransition((state) => {
        if (state.matches('IDLE')) {
          expect(state.context).toMatchObject({ notes: [] });
          done();
        }
      })
      .send('CREATE_EMPTY');
  });
});
