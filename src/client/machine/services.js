// @flow

import { encrypt, decrypt } from '../lib';

export async function getSiteService(ctx: TContext): Promise<TContext> {
  const { id } = ctx;
  const res = await fetch(
    `/api/id/${id}`,
  );

  const [error, data] = await res.json();

  if (error) {
    throw error;
  }

  return ({
    ...ctx,
    ...data,
  });
}

export async function postSiteService(ctx: TContext): Promise<TContext> {
  const {
    id,
    notes,
    password,
  } = ctx;

  const encrypted = encrypt(notes, password);

  const res = await fetch(
    `/api/id/${id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encrypted }),
    },
  );

  const [error] = await res.json();

  if (error) {
    throw error;
  }

  return ctx;
}

export async function deleteSiteService(ctx: TContext): Promise<TContext> {
  const { id } = ctx;

  const res = await fetch(`/api/id/${id}`, { method: 'DELETE' });

  await res.json();

  return ctx;
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
