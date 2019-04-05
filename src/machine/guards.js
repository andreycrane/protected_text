// @flow

export function wasSiteCreated(ctx): boolean {
  return (typeof ctx.encrypted === 'string');
}

export function wasSiteFree(ctx): boolean {
  return (ctx.encrypted === null);
}

export function wasSiteDecrypted(ctx): boolean {
  return Array.isArray(ctx.notes);
}
