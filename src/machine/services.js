// @flow

import { encrypt, decrypt } from '../lib';

export async function decryptService(ctx, event) {
  const { password } = event;
  const { encrypted } = ctx;

  const notes = decrypt(encrypted, password);

  return ({
    ...ctx,
    notes,
    password,
  });
}

export async function encryptService(ctx) {
  const { notes, password } = ctx;

  const encrypted = encrypt(notes, password);

  return ({
    ...ctx,
    encrypted,
  });
}
