// @flow

import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

export type TSerializable = {
  [string]: boolean | string | number | TSerializable,
};

export function encrypt(data: TSerializable, password: string): string {
  const json = JSON.stringify(data);
  const cipherParams = AES.encrypt(json, password);

  return cipherParams.toString();
}

export function decrypt(cipherText: string, password: string): TSerializable {
  const bytes = AES.decrypt(cipherText, password);

  const json = bytes.toString(Utf8);

  return JSON.parse(json);
}
