// @flow

export default function initContext(encrypted: string | null, name: string): TContext {
  return {
    encrypted,
    name,
    password: null,
    notes: null,
  };
}
