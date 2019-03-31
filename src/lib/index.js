// @flow

export function genId(): string {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}

export type TNeighbors<T> = $ReadOnly<{
  prev: T | null,
  next: T | null,
}>;

export function getNeighbors<T>(arr: $ReadOnlyArray<T>, item: T): TNeighbors<T> {
  const idx = arr.indexOf(item);

  if (idx === -1) {
    return {
      prev: null,
      next: null,
    };
  }

  return {
    prev: (idx === 0 ? null : arr[idx - 1]),
    next: (idx === (arr.length - 1) ? null : arr[idx + 1]),
  };
}

export function getPreferredNeighbor<T>(arr: $ReadOnlyArray<T>, item: T): T | null {
  const { prev, next } = getNeighbors<T>(arr, item);
  return prev || next;
}

export default { genId };
