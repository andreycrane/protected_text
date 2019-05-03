import { internet, random } from 'faker';

import { decryptService } from './services';
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
});
