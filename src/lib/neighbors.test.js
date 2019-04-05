import getPreferredNeighbor, { getNeighbors } from './neighbors';


describe('neighbors', () => {
  describe('getNeighbors', () => {
    it('returns right neighbors', () => {
      const arr = [1, 2, 3, 4, 5, 6];
      const samples = [
        { c: 1, next: 2, prev: null },
        { c: 3, next: 4, prev: 2 },
        { c: 6, next: null, prev: 5 },
      ];

      samples.forEach(({ c, next, prev }) => {
        const r = getNeighbors(arr, c);
        expect(r).toEqual({ prev, next });
      });
    });
  });

  describe('getPrefferdNeighbor', () => {
    it('returns preferred neighbor if it exists', () => {
      const arr = [1, 2, 3, 4, 5, 6];
      const samples = [
        { c: 1, expected: 2 },
        { c: 3, expected: 2 },
        { c: 6, expected: 5 },
      ];

      samples.forEach(({ c, expected }) => {
        const neighbor = getPreferredNeighbor(arr, c);
        expect(neighbor).toBe(expected);
      });
    });
  });
});
