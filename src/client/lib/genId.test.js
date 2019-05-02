import genId from './genId';

describe('genId', () => {
  it('returns unique string', () => {
    const r = [];
    for (let i = 0; i < 30; i += 1) {
      const id = genId();

      expect(r).not.toContain(id);
      r.push(id);
    }
  });
});
