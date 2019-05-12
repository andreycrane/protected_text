// @flow

import { assign } from 'xstate';

const SAVING = {
  initial: 'saving',
  states: {
    saving: {
      invoke: {
        id: 'saving',
        src: 'postSite',
        onDone: {
          actions: [
            assign((ctx: TContext, { data }) => ({ ...ctx, ...data })),
          ],
          target: '#machine.SAVED',
        },
        onError: 'error',
      },
    },
    error: {
      on: {
        REPEAT: 'saving',
        CANCEL: [
          {
            target: '#machine.MODIFIED',
            cond: ({ prevState }) => prevState === 'MODIFIED',
          },
          {
            target: '#machine.NEW',
            cond: ({ prevState }) => prevState === 'NEW',
          },
          {
            target: '#machine.NEW',
          },
        ],
      },
    },
  },
};

export default SAVING;
