// @flow

export function wasSiteCreated(ctx, event) {
  return (typeof ctx.encrypted === 'string');
}

export function wasSiteFree(ctx, event) {
  return (ctx.encrypted === null);
}

export function wasSiteDecrypted(ctx, event) {
  return Array.isArray(ctx.notes);
}
