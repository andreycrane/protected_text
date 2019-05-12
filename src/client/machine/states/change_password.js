// @flow

const CHANGE_PASSWORD = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        CREATE: [
          {
            target: '#machine.MODIFIED',
            actions: 'setPassword',
            cond: 'canSetPassword',
          },
          {
            target: 'error',
          },
        ],
        CANCEL: [
          {
            target: '#machine.MODIFIED',
            cond: ({ prevState }) => prevState === 'MODIFIED',
          },
          {
            target: '#machine.SAVED',
            cond: ({ prevState }) => prevState === 'SAVED',
          },
          {
            target: '#machine.MODIFIED',
          },
        ],
      },
    },
    error: {
      on: {
        CREATE: [
          {
            target: '#machine.MODIFIED',
            actions: 'setPassword',
            cond: 'canSetPassword',
          },
          {
            target: 'error',
          },
        ],
        CANCEL: [
          {
            target: '#machine.MODIFIED',
            cond: ({ prevState }) => prevState === 'MODIFIED',
          },
          {
            target: '#machine.SAVED',
            cond: ({ prevState }) => prevState === 'SAVED',
          },
          {
            target: '#machine.MODIFIED',
          },
        ],
      },
    },
  },
};

export default CHANGE_PASSWORD;
