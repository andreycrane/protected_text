import { internet, random } from 'faker';

import { decryptService, encryptService } from './services';
import { encrypt } from '../lib';

describe('services', () => {
  describe('decryptService', () => {
    it('rejects if password is wrong', () => {
      const encrypted = encrypt(
        { [random.objectElement()]: random.words() },
        internet.password(),
      );
      const password = internet.password();
      const ctx = { encrypted };

      return expect(decryptService(ctx, { password })).rejects.toThrow();
    });

    it('resolves if password is right', () => {
      const password = internet.password();
      const notes = { [random.objectElement()]: random.words() };
      const encrypted = encrypt(notes, password);
      const ctx = { encrypted };

      return expect(decryptService(ctx, { password })).resolves.toMatchObject({
        notes,
        password,
      });
    });
  });

  describe('encryptService', () => {
    it('encrypts data', () => {
      const notes = [
        { id: random.uuid(), lorem: random.word() },
        { id: random.uuid(), lorem: random.word() },
        { id: random.uuid(), lorem: random.word() },
      ];
      const password = internet.password();
      const oldCtx = { notes, password };

      return expect(encryptService(oldCtx)).resolves.toHaveProperty('encrypted');
    });
  });
});
