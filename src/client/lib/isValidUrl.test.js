import { lorem, random } from 'faker';
import isValidUrl from './isValidUrl';

describe('isValidUrl', () => {
  it('return "true" if notes url is valid, otherwise "false"', () => {
    [
      [lorem.word(), true],
      [lorem.words(), false],
      [`${random.number()}`, true],
      [random.uuid(), true],
    ].forEach(([sample, result]) => {
      const msg = `sample: ${[sample]}`;
      const expected = { msg, result };

      expect({ msg, result: isValidUrl(sample) }).toMatchObject(expected);
    });
  });
});
