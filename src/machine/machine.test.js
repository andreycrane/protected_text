import { interpret, State } from 'xstate';
import { internet } from 'faker';

import { encrypt } from '../lib';

import machine from './machine';
import initContext from './context';

describe.only('machine', () => {
  describe('INITIAL state', () => {
    it('moves from INITIAL state to ENCRYPTED state', (done) => {
      const initialContext = initContext('enrypted_data', 'site_name');
      const testMachine = machine.withContext(initialContext);

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches({ ENCRYPTED: 'idle' })) {
            expect(state.context).toMatchObject(initialContext);
            done();
          }
        })
        .start();
    });

    it('moves from INITIAL state to FREE state', (done) => {
      const initialContext = initContext(null, 'site_name');
      const testMachine = machine.withContext(initialContext);

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches('FREE')) {
            expect(state.context).toMatchObject(initialContext);
            done();
          }
        })
        .start();
    });
  });

  describe('FREE state', () => {
    it('moves from FREE state to IDLE on CREATE_EMPTY', (done) => {
      const context = initContext(null, 'site_name');
      const FreeState = State.create({
        value: 'FREE',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('IDLE')) {
            expect(state.context).toHaveProperty('notes');
            expect(state.context.notes).toHaveLength(1);
            done();
          }
        })
        .start(FreeState)
        .send('CREATE_EMPTY');
    });
  });

  describe('ENCRYPTED state', () => {
    it('moves to IDLE on DECRYPT if password is right', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext(encrypt(notes, password), 'site_name');
      const EncryptedIdleState = State.create({
        value: { ENCRYPTED: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('IDLE')) {
            done();
          }
        })
        .start(EncryptedIdleState)
        .send({ type: 'DECRYPT', password });
    });

    it('moves to ENCRYPTED.error on DECRYPT if password is wrong', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext(encrypt(notes, password), 'site_name');
      const EncryptedIdleState = State.create({
        value: { ENCRYPTED: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('ENCRYPTED.error')) {
            done();
          }
        })
        .start(EncryptedIdleState)
        .send({ type: 'DECRYPT', password: internet.password() });
    });

    it('moves from ENCRYPTED.error to IDLE on DECRYPT if password is right', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext(encrypt(notes, password), 'site_name');
      const EncryptedErrorState = State.create({
        value: { ENCRYPTED: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('IDLE')) {
            done();
          }
        })
        .start(EncryptedErrorState)
        .send({ type: 'DECRYPT', password });
    });

    it('moves from ENCRYPTED.error to ENCRYPTED.error on DECRYPT if password is wrong', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext(encrypt(notes, password), 'site_name');
      const EncryptedErrorState = State.create({
        value: { ENCRYPTED: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches({ ENCRYPTED: 'error' })) {
            done();
          }
        })
        .start(EncryptedErrorState)
        .send({ type: 'DECRYPT', password: internet.password() });
    });
  });
});
