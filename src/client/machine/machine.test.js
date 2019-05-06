import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../lib';

import machine from './machine';
import initContext from './context';
import {
  getSiteService,
  postSiteService,
  deleteSiteService,
} from './services';

jest.mock('./services', () => {
  const t = jest.requireActual('./services');
  t.getSiteService = jest.fn(async () => null);
  t.postSiteService = jest.fn(async () => null);
  t.deleteSiteService = jest.fn(async () => null);

  return t;
});

describe('machine', () => {
  describe('INITIAL state', () => {
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
            done();
          }
        })
        .start();
    });

    it('move to FREE if service resolves without encrypted data', (done) => {
      const id = random.uuid();
      const initialContext = initContext(id);
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
            expect(state.context).toMatchObject(initialContext);
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

  describe('FREE state', () => {
    it('moves to NEW on CREATE_EMPTY', (done) => {
      const context = initContext('site_name');
      const FreeState = State.create({
        value: 'FREE',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('NEW')) {
            expect(state.context).toHaveProperty('notes');
            expect(state.context.notes).toHaveLength(1);
            done();
          }
        })
        .start(FreeState)
        .send('CREATE_EMPTY');
    });

    it('moves to EXIT on CANCEL', (done) => {
      const context = initContext('site_name');
      const FreeState = State.create({
        value: 'FREE',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('EXIT')) {
            done();
          }
        })
        .start(FreeState)
        .send('CANCEL');
    });
  });

  describe('ENCRYPTED state', () => {
    it('moves to SAVED on DECRYPT if password is right', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext('site_name', encrypt(notes, password));
      const EncryptedIdleState = State.create({
        value: { ENCRYPTED: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('SAVED')) {
            done();
          }
        })
        .start(EncryptedIdleState)
        .send({ type: 'DECRYPT', password });
    });

    it('moves to ENCRYPTED.error on DECRYPT if password is wrong', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext('site_name', encrypt(notes, password));
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

    it('moves to EXIT on CANCEL', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext('site_name', encrypt(notes, password));
      const EncryptedIdleState = State.create({
        value: { ENCRYPTED: 'idle' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('EXIT')) {
            done();
          }
        })
        .start(EncryptedIdleState)
        .send('CANCEL');
    });

    it('moves from ENCRYPTED.error to SAVED on DECRYPT if password is right', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext('site_name', encrypt(notes, password));
      const EncryptedErrorState = State.create({
        value: { ENCRYPTED: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('SAVED')) {
            done();
          }
        })
        .start(EncryptedErrorState)
        .send({ type: 'DECRYPT', password });
    });

    it('moves from ENCRYPTED.error to ENCRYPTED.error on DECRYPT if password is wrong', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext('site_name', encrypt(notes, password));
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

    it('moves from ENCRYPTED.error to EXIT on CANCEL', (done) => {
      const password = internet.password();
      const notes = [];
      const context = initContext('site_name', encrypt(notes, password));
      const EncryptedErrorState = State.create({
        value: { ENCRYPTED: 'error' },
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('EXIT')) {
            done();
          }
        })
        .start(EncryptedErrorState)
        .send('CANCEL');
    });
  });

  describe('NEW state', () => {
    it('moves to MODIFIED on NEW', (done) => {
      const context = {
        notes: [],
      };
      const NewState = State.create({
        value: 'NEW',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(NewState)
        .send('NEW_NOTE');
    });

    it('moves to MODIFIED on REMOVE_NOTE', (done) => {
      const id = random.uuid();
      const context = {
        notes: [{ id, label: random.words() }],
      };
      const NewState = State.create({
        value: 'NEW',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(NewState)
        .send({ type: 'NEW_NOTE', id });
    });

    it('moves to MODIFIED on UPDATE_NOTE', (done) => {
      const id = random.uuid();
      const note = { id, label: random.words() };
      const context = {
        notes: [note],
      };
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
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(NewState)
        .send({ type: 'UPDATE_NOTE', note: updatedNote });
    });

    it('stays on NEW on CHANGE_CURRENT', (done) => {
      const oldId = random.uuid();
      const newId = random.uuid();
      const context = {
        notes: [
          { id: oldId, label: random.words() },
          { id: newId, label: random.words() },
        ],
        currentId: oldId,
      };
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
        .send({ type: 'CHANGE_CURRENT', newId });
    });
  });

  describe('SAVED state', () => {
    it('moves to MODIFIED on NEW_NOTE', (done) => {
      const context = {
        notes: [],
      };
      const SavedState = State.create({
        value: 'SAVED',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(SavedState)
        .send('NEW_NOTE');
    });

    it('moves to MODIFIED on REMOVE_NOTE', (done) => {
      const id = random.uuid();
      const context = {
        notes: [{ id, label: random.words() }],
      };
      const SavedState = State.create({
        value: 'SAVED',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(SavedState)
        .send({ type: 'NEW_NOTE', id });
    });

    it('moves to MODIFIED on UPDATE_NOTE', (done) => {
      const id = random.uuid();
      const note = { id, label: random.words() };
      const context = {
        notes: [note],
      };
      const SavedState = State.create({
        value: 'SAVED',
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
        .start(SavedState)
        .send({ type: 'UPDATE_NOTE', note: updatedNote });
    });

    it('stays on SAVED on CHANGE_CURRENT', (done) => {
      const oldId = random.uuid();
      const newId = random.uuid();
      const context = {
        notes: [
          { id: oldId, label: random.words() },
          { id: newId, label: random.words() },
        ],
        currentId: oldId,
      };
      const SavedState = State.create({
        value: 'SAVED',
        context,
      });

      interpret(machine)
        .onTransition((state) => {
          if (state.changed === true && state.matches('SAVED')) {
            done();
          }
        })
        .start(SavedState)
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

  describe('SAVING state', () => {
    it('moves to SAVING:saving children state', (done) => {
      const context = initContext('site_name');
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
      const id = random.uuid();
      const context = initContext(id);
      const testMachine = machine.withContext(context);
      testMachine.initial = 'SAVING';

      postSiteService.mockImplementation(async () => true);

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches('SAVED')) {
            done();
          }
        })
        .start();
    });

    it('moves to SAVING.error if service rejects', (done) => {
      const id = random.uuid();
      const context = initContext(id);
      const testMachine = machine.withContext(context);
      testMachine.initial = 'SAVING';

      postSiteService.mockImplementation(async () => { throw new Error(); });

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches({ SAVING: 'error' })) {
            done();
          }
        })
        .start();
    });

    it('moves from SAVING.error to SAVING.saving on REPEAT', (done) => {
      const id = random.uuid();
      const context = initContext(id);
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

    it('moves from SAVING.error to MODIFIED on CANCEL', (done) => {
      const id = random.uuid();
      const context = initContext(id);
      const testMachine = machine.withContext(context);
      const SavingState = State.create({
        value: { SAVING: 'error' },
        context,
      });

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(SavingState)
        .send('CANCEL');
    });
  });

  describe('DELETING state', () => {
    it('moves to DELETING:confirm children state', (done) => {
      const context = initContext('site_name');
      const testMachine = machine.withContext(context);
      const DeletingState = State.create({
        value: 'DELETING',
        context,
      });

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches({ DELETING: 'confirm' })) {
            done();
          }
        })
        .start(DeletingState);
    });

    it('moves from DELETING:confirm to MODIFIED on CANCEL', (done) => {
      const context = initContext('site_name');
      const testMachine = machine.withContext(context);
      const DeletingState = State.create({
        value: { DELETING: 'confirm' },
        context,
      });

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(DeletingState)
        .send('CANCEL');
    });

    it('moves from DELETING:confirm to DELETING:deleting on OK', (done) => {
      const context = initContext('site_name');
      const testMachine = machine.withContext(context);
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
      const context = initContext('site_name');
      const testMachine = machine.withContext(context);

      const DeletingState = State.create({
        value: 'DELETING',
        context,
      });

      deleteSiteService.mockImplementation(async () => true);

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
      const context = initContext('site_name');
      const testMachine = machine.withContext(context);

      const DeletingState = State.create({
        value: 'DELETING',
        context,
      });

      deleteSiteService.mockImplementation(async () => { throw new Error(); });

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
      const context = initContext('site_name');
      const testMachine = machine.withContext(context);

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

    it('moves from DELETING:error to MODIFIED on CANCEL', (done) => {
      const context = initContext('site_name');
      const testMachine = machine.withContext(context);

      const DeletingState = State.create({
        value: { DELETING: 'error' },
        context,
      });

      interpret(testMachine)
        .onTransition((state) => {
          if (state.matches('MODIFIED')) {
            done();
          }
        })
        .start(DeletingState)
        .send('CANCEL');
    });
  });
});
