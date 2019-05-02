// @flow

export function wasSiteCreated(ctx: TContext): boolean {
  return (typeof ctx.encrypted === 'string');
}

export function wasSiteFree(ctx: TContext): boolean {
  return (ctx.encrypted === null);
}

export function wasSiteDecrypted(ctx: TContext): boolean {
  return Array.isArray(ctx.notes);
}

export function hasPassword(ctx: TContext): boolean {
  return typeof ctx.password === 'string' && ctx.password.length > 0;
}

export function canSetPassword(ctx: TContext, event: TEvent): boolean {
  const { password } = event;

  return typeof password === 'string' && password.length > 0;
}
