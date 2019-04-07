// @flow

export default function initContext(encrypted: string | null, name: string) {
  return {
    encrypted,
    name,
  };
}
