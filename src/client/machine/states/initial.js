// @flow

import { assign } from 'xstate'; // or use your own interpreter!

const INITIAL = {
  initial: 'get_site',
  states: {
    get_site: {
      invoke: {
        src: 'getSite',
        onDone: {
          target: 'success',
          actions: assign((ctx, event): TContext => ({ ...ctx, ...event.data })),
        },
        onError: 'error',
      },
    },
    success: {
      on: {
        '': [
          { target: '#machine.ENCRYPTED', cond: 'wasSiteCreated' },
          { target: '#machine.FREE', cond: 'wasSiteFree' },
        ],
      },
    },
    error: {
      on: {
        REPEAT: 'get_site',
        CANCEL: '#machine.EXIT',
      },
    },
  },
};

export default INITIAL;
