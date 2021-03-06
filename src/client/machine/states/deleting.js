// @flow

const DELETING = {
  initial: 'confirm',
  states: {
    confirm: {
      on: {
        OK: 'deleting',
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
    deleting: {
      invoke: {
        id: 'deleting',
        src: 'deleteSite',
        onDone: '#machine.EXIT',
        onError: 'error',
      },
    },
    error: {
      on: {
        REPEAT: 'deleting',
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
      meta: {
        message: 'Something went wrong while we tried to delete your notes',
      },
    },
  },
};

export default DELETING;
