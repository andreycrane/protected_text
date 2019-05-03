// @flow

import { encrypt, decrypt } from '../lib';

export async function getSiteService(ctx: TContext, event: TEvent): Promise<TContext> {
  return { something: 'something' };
}

export async function postSiteService(ctx: TContext, event: TEvent): Promise<TContext> {
}

export async function deleteSiteService(ctx: TContext, event: TEvent): Promise<TContext> {
}

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
