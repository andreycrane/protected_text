import isObject from './isObject';

describe('isObject', () => {
  it('returns true if value is an object', () => {
    [
      [{}, true],
      [() => {}, true],
      [null, false],
      [undefined, false],
      ['lol', false],
      [1, false],
      [true, false],
    ].forEach(([value, expected]) => {
      const r = isObject(value);

      expect(r).toBe(expected);
    });
  });
});
