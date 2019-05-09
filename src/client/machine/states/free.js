// @flow

import { send } from 'xstate';

const FREE = {
  on: {
    CREATE_EMPTY: {
      actions: ['createEmpty', send('GO_NEW')],
    },
    GO_NEW: {
      target: 'NEW',
      cond: 'wasSiteDecrypted',
    },
    CANCEL: '#machine.EXIT',
  },
};

export default FREE;
