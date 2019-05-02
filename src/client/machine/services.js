// @flow

import { encrypt, decrypt } from '../lib';

export async function decryptService(ctx: TContext, event: TEvent): Promise<TContext> {
  const { password } = event;
  const { encrypted } = ctx;

  const notes = decrypt(encrypted, password);

  return ({
    ...ctx,
    notes,
    password,
  });
}

export async function encryptService(ctx: TContext): Promise<TContext> {
  const { notes, password } = ctx;

  const encrypted = encrypt(notes, password);

  return ({
    ...ctx,
    encrypted,
  });
}
