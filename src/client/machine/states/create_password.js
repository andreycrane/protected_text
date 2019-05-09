// @flow

const CREATE_PASSWORD = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        CREATE: [
          {
            target: 'success',
            actions: 'setPassword',
            cond: 'canSetPassword',
          },
          {
            target: 'error',
          },
        ],
        CANCEL: '#machine.MODIFIED',
      },
    },
    error: {
      on: {
        CREATE: [
          {
            target: 'success',
            actions: 'setPassword',
            cond: 'canSetPassword',
          },
          {
            target: 'error',
          },
        ],
        CANCEL: '#machine.MODIFIED',
      },
    },
    success: {
      on: {
        '': '#machine.SAVING',
      },
    },
  },
};

export default CREATE_PASSWORD;
