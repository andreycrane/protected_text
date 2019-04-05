import {
  wasSiteCreated,
  wasSiteFree,
  wasSiteDecrypted,
} from './guards';


describe('machine#guards', () => {
  describe('wasSiteCreated', () => {
    it('returns "true" if encrypted data exists', () => {
      const ctx = { encrypted: '{ test: "hello" }' };
      const r = wasSiteCreated(ctx);

      expect(r).toBe(true);
    });

    it('returns "false" if encrypted data doesn\'t exist', () => {
      const ctx = { encrypted: null };
      const r = wasSiteCreated(ctx);

      expect(r).toBe(false);
    });
  });

  describe('wasSiteFree', () => {
    it('returns "true" if encrypted data doesn\'t exist', () => {
      const ctx = { encrypted: null };
      const r = wasSiteFree(ctx);

      expect(r).toBe(true);
    });

    it('returns "false" if encrypted data exists', () => {
      const ctx = { encrypted: '{"hello":"world"}' };
      const r = wasSiteFree(ctx);

      expect(r).toBe(false);
    });
  });

  describe('wasSiteDecrypted', () => {
    it('returns "true" if decrypted data exists', () => {
      const ctx = { notes: ['note1', 'note2'] };
      const r = wasSiteDecrypted(ctx);

      expect(r).toBe(true);
    });

    it('returns "false" if decrypted data doesn\'t exist', () => {
      const ctx = {};
      const r = wasSiteCreated(ctx);

      expect(r).toBe(false);
    });
  });
});
