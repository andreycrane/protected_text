import { random, internet } from 'faker';

import { encrypt, decrypt } from './cipher';

describe('cipher', () => {
  it('encrypts and decrypts data correctly', () => {
    for (let i = 0; i < 20; i += 1) {
      const password = internet.password();
      const object = {
        [random.word()]: random.words(),
        [random.word()]: random.number(),
        [random.word()]: random.boolean(),
      };

      const encrypted = encrypt(object, password);
      const decrypted = decrypt(encrypted, password);

      expect(decrypted).toEqual(object);
    }
  });
});
