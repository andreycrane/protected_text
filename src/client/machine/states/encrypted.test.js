import { interpret, State } from 'xstate';
import { random, internet } from 'faker';

import { encrypt } from '../../lib';
import machine from '../machine';
import initContext from '../context';

describe('machine#ENCRYPTED state', () => {
  const siteId = random.uuid();
  const noteId = random.uuid();
  const note = {
    id: noteId,
    [random.objectElement()]: random.uuid(),
  };
  const notes = [note];
  const password = internet.password();
  const encrypted = encrypt(notes, password);

  it('moves to SAVED on DECRYPT if password is right', (done) => {
    const context = initContext(siteId, encrypted);
    const EncryptedIdleState = State.create({
      value: { ENCRYPTED: 'idle' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('SAVED')) {
          expect(state.context).toMatchObject({
            id: siteId,
            encrypted,
            password,
            notes,
            currentId: note.id,
          });
          done();
        }
      })
      .start(EncryptedIdleState)
      .send({ type: 'DECRYPT', password });
  });

  it('moves to ENCRYPTED.error on DECRYPT if password is wrong', (done) => {
    const context = initContext(siteId, encrypted);
    const EncryptedIdleState = State.create({
      value: { ENCRYPTED: 'idle' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('ENCRYPTED.error')) {
          expect(state.context).toMatchObject({
            id: siteId,
            encrypted,
            password: null,
            notes: null,
            currentId: null,
          });
          done();
        }
      })
      .start(EncryptedIdleState)
      .send({ type: 'DECRYPT', password: internet.password() });
  });

  it('moves to EXIT on CANCEL', (done) => {
    const context = initContext(siteId, encrypted);
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
    const context = initContext(siteId, encrypted);
    const EncryptedErrorState = State.create({
      value: { ENCRYPTED: 'error' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('SAVED')) {
          expect(state.context).toMatchObject({
            id: siteId,
            encrypted,
            password,
            notes,
            currentId: note.id,
          });
          done();
        }
      })
      .start(EncryptedErrorState)
      .send({ type: 'DECRYPT', password });
  });

  it('moves from ENCRYPTED.error to ENCRYPTED.error on DECRYPT if password is wrong', (done) => {
    const context = initContext(siteId, encrypted);
    const EncryptedErrorState = State.create({
      value: { ENCRYPTED: 'error' },
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches({ ENCRYPTED: 'error' })) {
          expect(state.context).toMatchObject({
            id: siteId,
            encrypted,
            password: null,
            notes: null,
            currentId: null,
          });
          done();
        }
      })
      .start(EncryptedErrorState)
      .send({ type: 'DECRYPT', password: internet.password() });
  });

  it('moves from ENCRYPTED.error to EXIT on CANCEL', (done) => {
    const context = initContext(siteId, encrypted);
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
