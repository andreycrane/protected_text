// @flow

export default function initContext(id: string): TContext {
  return {
    id,
    encrypted: null,
    password: null,
    notes: null,
    currentId: null,
  };
}
