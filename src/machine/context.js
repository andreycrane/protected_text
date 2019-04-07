// @flow

import { encrypt } from '../lib';

export default function initContext() {
  return {
    encrypted: encrypt({ notes: [] }, 'test123'),
    name: 'test_domain',
  };
}
