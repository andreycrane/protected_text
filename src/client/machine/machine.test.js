import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../lib';

import machine from './machine';
import initContext from './context';
import { getSiteService } from './services';

jest.mock('./services', () => {
  const t = jest.requireActual('./services');
  t.getSiteService = jest.fn(async () => null);

  return t;
});

describe('machine', () => {
  describe('INITIAL state', () => {
    it('moves to get_site children state', (done) => {
      const initialContext = initContext(null, 'site_name');
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

    it('move to ENCRYPTED:idle if service resolves with encrypted data', (done) => {
      const id = random.uuid();
      const data = random.words();
      const initialContext = initContext(null, id);
      const testMachine = machine.withContext(initialContext);

      getSiteService.mockImplementation(async () => ({ id, data }));

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches({ ENCRYPTED: 'idle' })) {
            done();
          }
        })
        .start();
    });

    it('move to FREE if service resolves without encrypted data', (done) => {
      const id = random.uuid();
      const initialContext = initContext(null, id);
      const testMachine = machine.withContext(initialContext);

      getSiteService.mockImplementation(async () => ({ id, data: null }));

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches('FREE')) {
            done();
          }
        })
        .start();
    });

    it('move to INITIAL:error if service rejected', (done) => {
      const id = random.uuid();
      const initialContext = initContext(null, id);
      const testMachine = machine.withContext(initialContext);

      getSiteService.mockImplementation(async () => {
        throw new Error();
      });

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches({ INITIAL: 'error' })) {
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
  });

  describe('CREATE_PASSWORD state', () => {
    it('moves to MODIFIED on CANCEL', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const CreatePassword = State.create({
        value: { CREATE_PASSWORD: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('MODIFIED')) {
            done();
          }
        })
        .start(CreatePassword)
        .send('CANCEL');
    });

    it('moves to SAVING on CREATE if password exists', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const CreatePassword = State.create({
        value: { CREATE_PASSWORD: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('SAVING')) {
            done();
          }
        })
        .start(CreatePassword)
        .send({ type: 'CREATE', password: internet.password() });
    });

    it('moves to { CREATE_PASSWORD: error } on CREATE if password doesn\'t exist', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const CreatePassword = State.create({
        value: { CREATE_PASSWORD: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches({ CREATE_PASSWORD: 'error' })) {
            done();
          }
        })
        .start(CreatePassword)
        .send({ type: 'CREATE', password: null });
    });

    it('moves from { CREATE_PASSWORD: error } to MODIFIED on CANCEL', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const CreatePassword = State.create({
        value: { CREATE_PASSWORD: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('MODIFIED')) {
            done();
          }
        })
        .start(CreatePassword)
        .send('CANCEL');
    });

    it('moves from { CREATE_PASSWORD: error } to SAVING on CREATE if password exists', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const password = internet.password();
      const CreatePassword = State.create({
        value: { CREATE_PASSWORD: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('SAVING')) {
            done();
          }
        })
        .start(CreatePassword)
        .send({ type: 'CREATE', password });
    });

    it('moves from { CREATE_PASSWORD: error } to itself on CREATE if password doesn\'t exist', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const CreatePassword = State.create({
        value: { CREATE_PASSWORD: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches({ CREATE_PASSWORD: 'error' })) {
            done();
          }
        })
        .start(CreatePassword)
        .send({ type: 'CREATE' });
    });
  });

  describe('CHANGE_PASSWORD state', () => {
    it('moves to MODIFIED on CREATE if password exists', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const ChangePassword = State.create({
        value: { CHANGE_PASSWORD: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('MODIFIED')) {
            done();
          }
        })
        .start(ChangePassword)
        .send({ type: 'CREATE', password: internet.password() });
    });

    it('moves to { CHANGE_PASSWORD: error } on CREATE if password doesn\'t exist', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const ChangePassword = State.create({
        value: { CHANGE_PASSWORD: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches({ CHANGE_PASSWORD: 'error' })) {
            done();
          }
        })
        .start(ChangePassword)
        .send({ type: 'CREATE', password: null });
    });

    it('moves from { CHANGE_PASSWORD: error } to MODIFIED on CREATE if password exists', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const ChangePassword = State.create({
        value: { CHANGE_PASSWORD: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('MODIFIED')) {
            done();
          }
        })
        .start(ChangePassword)
        .send({ type: 'CREATE', password: internet.password() });
    });

    it('moves from { CHANGE_PASSWORD: error } to itself on CREATE if password doesn\'t exist', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const ChangePassword = State.create({
        value: { CHANGE_PASSWORD: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches({ CHANGE_PASSWORD: 'error' })) {
            done();
          }
        })
        .start(ChangePassword)
        .send({ type: 'CREATE', password: null });
    });

    it('moves from { CHANGE_PASSWORD: error } to MODIFIED on CANCEL', (done) => {
      const context = {
        password: null,
        notes: [
          { id: random.uuid(), label: random.words() },
          { id: random.uuid(), label: random.words() },
        ],
        currentId: random.uuid(),
      };
      const ChangePassword = State.create({
        value: { CHANGE_PASSWORD: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('MODIFIED')) {
            done();
          }
        })
        .start(ChangePassword)
        .send('CANCEL');
    });
  });
});
