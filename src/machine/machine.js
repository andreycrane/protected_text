// @flow

import { Machine, assign, send } from 'xstate'; // or use your own interpreter!

import {
  decrypt,
  createEmpty,
} from './actions';

import {
  wasSiteCreated,
  wasSiteFree,
  wasSiteDecrypted,
} from './guards';

const machine = Machine(
  {
    initial: 'INITIAL',
    context: {
      encrypted: null,
    },
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
        on: {
          DECRYPT: {
            actions: ['decrypt', send('GO_IDLE')],
          },
          CLOSE: {
            actions: ['close'],
          },
          GO_IDLE: {
            target: 'IDLE',
            cond: 'wasSiteDecrypted',
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
      IDLE: {
        onEntry: ['idleEntry'],
      },
    },
  },
  {
    actions: {
      decrypt: assign(decrypt),
      createEmpty: assign(createEmpty),
      close(ctx, event) {},
      idleEntry(ctx, event) {},
    },
    guards: {
      wasSiteCreated,
      wasSiteFree,
      wasSiteDecrypted,
    },
  },
);

export default machine;
