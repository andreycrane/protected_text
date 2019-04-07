// @flow

import {
  Machine,
  assign,
  send,
} from 'xstate'; // or use your own interpreter!

import {
  createFromDecryptedAction,
  createEmptyAction,
  closeAction,
  idleEntryAction,
} from './actions';

import {
  wasSiteCreated,
  wasSiteFree,
  wasSiteDecrypted,
} from './guards';

import {
  decryptService,
  encryptService,
} from './services';

import initContext from './context';

const machine = Machine(
  {
    strict: true,
    id: 'machine',
    initial: 'INITIAL',
    context: initContext(null, 'site_name'),
    states: {
      INITIAL: {
        on: {
          // Transient transitions
          '': [
            { target: 'ENCRYPTED', cond: 'wasSiteCreated' },
            { target: 'FREE', cond: 'wasSiteFree' },
          ],
        },
      },
      ENCRYPTED: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              DECRYPT: 'decrypting',
            },
          },
          decrypting: {
            invoke: {
              src: 'decrypt',
              onDone: {
                target: 'success',
                actions: 'createFromDecrypted',
              },
              onError: 'error',
            },
          },
          error: {
            on: {
              DECRYPT: 'decrypting',
            },
          },
          success: {
            on: {
              '': {
                target: '#machine.IDLE',
                cond: 'wasSiteDecrypted',
              },
            },
          },
        },
      },
      FREE: {
        on: {
          CREATE_EMPTY: {
            actions: ['createEmpty', send('GO_IDLE')],
          },
          GO_IDLE: {
            target: 'IDLE',
            cond: 'wasSiteDecrypted',
          },
        },
      },
      IDLE: {},
    },
  },
  {
    actions: {
      createFromDecrypted: assign(createFromDecryptedAction),
      createEmpty: assign(createEmptyAction),
      close: closeAction,
      idleEntry: idleEntryAction,
    },
    guards: {
      wasSiteCreated,
      wasSiteFree,
      wasSiteDecrypted,
    },
    services: {
      encrypt: encryptService,
      decrypt: decryptService,
    },
  },
);

export default machine;
