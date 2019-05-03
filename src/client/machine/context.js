// @flow

export default function initContext(id: string, encrypted: string | null = null): TContext {
  return {
    id,
    encrypted,
    password: null,
    notes: null,
    currentId: null,
  };
}
