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
        CANCEL: [
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
        CANCEL: [
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
    success: {
      on: {
        '': '#machine.SAVING',
      },
    },
  },
};

export default CREATE_PASSWORD;
