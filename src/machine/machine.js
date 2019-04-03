// @flow
import { Machine, assign, send } from 'xstate'; // or use your own interpreter!

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
      decrypt: assign((ctx, event) => {
        return ({
          ...ctx,
          notes: [],
        });
      }),
      createEmpty: assign((ctx, event) => {
        return ({
          ...ctx,
          notes: [],
        });
      }),
      close(ctx, event) {
      },
      idleEntry(ctx, event) {
      },
    },
    guards: {
      wasSiteCreated(ctx, event) {
        return (typeof ctx.encrypted === 'string');
      },
      wasSiteFree(ctx, event) {
        return (ctx.encrypted === null);
      },
      wasSiteDecrypted(ctx, event) {
        return Array.isArray(ctx.notes);
      },
    },
  },
);

export default machine;
