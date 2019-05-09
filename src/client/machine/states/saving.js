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
        CANCEL: '#machine.MODIFIED',
      },
    },
  },
};

export default SAVING;
