// @flow

export default function genId(): string {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}
