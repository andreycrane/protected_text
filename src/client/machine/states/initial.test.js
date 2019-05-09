import { interpret, State } from 'xstate';
import { random } from 'faker';

import machine from '../machine';
import initContext from '../context';

import { getSiteService } from '../services';

jest.mock('../services', () => {
  const t = jest.requireActual('../services');
  t.getSiteService = jest.fn(async () => null);

  return t;
});

describe('machine#INITIAL state', () => {
  it('moves to INITIAL:get_site children state', (done) => {
    const initialContext = initContext('site_name');
    const testMachine = machine.withContext(initialContext);

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ INITIAL: 'get_site' })) {
          expect(state.context).toMatchObject(initialContext);
          done();
        }
      })
      .start();
  });

  it('moves to ENCRYPTED:idle if service resolves with encrypted data', (done) => {
    const id = random.uuid();
    const encrypted = random.words();
    const initialContext = initContext(id);
    const testMachine = machine.withContext(initialContext);

    getSiteService.mockImplementation(async () => ({ id, encrypted }));

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ ENCRYPTED: 'idle' })) {
          expect(state.context).toHaveProperty('encrypted', encrypted);
          expect(state.context).toHaveProperty('id', id);
          done();
        }
      })
      .start();
  });

  it('move to FREE if service resolves without encrypted data', (done) => {
    const id = random.uuid();
    const initialContext = initContext(id);
    const testMachine = machine.withContext(initialContext);

    getSiteService.mockImplementation(async () => ({ id, encrypted: null }));

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches('FREE')) {
          expect(state.context).toHaveProperty('encrypted', null);
          expect(state.context).toHaveProperty('id', id);
          done();
        }
      })
      .start();
  });

  it('moves to INITIAL:error if service rejected', (done) => {
    const id = random.uuid();
    const initialContext = initContext(id);
    const testMachine = machine.withContext(initialContext);

    getSiteService.mockImplementation(async () => {
      throw new Error();
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ INITIAL: 'error' })) {
          expect(state.context).toBe(initialContext);
          done();
        }
      })
      .start();
  });

  it('moves from INITIAL.error to INITIAL:get_site on REPEAT', (done) => {
    const id = random.uuid();
    const context = initContext(id);
    const InitialState = State.create({
      value: { INITIAL: 'error' },
      context,
    });
    interpret(machine)
      .onTransition((state) => {
        if (state.matches({ INITIAL: 'get_site' })) {
          done();
        }
      })
      .start(InitialState)
      .send('REPEAT');
  });

  it('moves from INITIAL.error to EXIT on CANCEL', (done) => {
    const id = random.uuid();
    const context = initContext(id);
    const InitialState = State.create({
      value: { INITIAL: 'error' },
      context,
    });
    interpret(machine)
      .onTransition((state) => {
        if (state.matches('EXIT')) {
          done();
        }
      })
      .start(InitialState)
      .send('CANCEL');
  });
});
