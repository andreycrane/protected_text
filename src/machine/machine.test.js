import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../lib';

import machine from './machine';
import initContext from './context';

describe('machine', () => {
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

  describe('IDLE state', () => {
    it('moves to MODIFIED on NEW_NOTE', (done) => {
      const context = {
        notes: [],
      };
      const IdleState = State.create({
        value: 'IDLE',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(IdleState)
        .send('NEW_NOTE');
    });

    it('moves to MODIFIED on REMOVE_NOTE', (done) => {
      const id = random.uuid();
      const context = {
        notes: [{ id, label: random.words() }],
      };
      const IdleState = State.create({
        value: 'IDLE',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(IdleState)
        .send({ type: 'NEW_NOTE', id });
    });

    it('moves to MODIFIED on UPDATE_NOTE', (done) => {
      const id = random.uuid();
      const note = { id, label: random.words() };
      const context = {
        notes: [note],
      };
      const IdleState = State.create({
        value: 'IDLE',
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
        .start(IdleState)
        .send({ type: 'UPDATE_NOTE', note: updatedNote });
    });

    it('stays on IDLE on CHANGE_CURRENT', (done) => {
      const oldId = random.uuid();
      const newId = random.uuid();
      const context = {
        notes: [
          { id: oldId, label: random.words() },
          { id: newId, label: random.words() },
        ],
        currentId: oldId,
      };
      const IdleState = State.create({
        value: 'IDLE',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('IDLE')) {
            done();
          }
        })
        .start(IdleState)
        .send({ type: 'CHANGE_CURRENT', newId });
    });
  });

  describe('MODIFIED state', () => {
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
  });
});
