// @flow

const ENCRYPTED = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        DECRYPT: 'decrypting',
        CANCEL: '#machine.EXIT',
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
        CANCEL: '#machine.EXIT',
      },
    },
    success: {
      on: {
        '': {
          target: '#machine.SAVED',
          cond: 'wasSiteDecrypted',
        },
      },
    },
  },
};

export default ENCRYPTED;
