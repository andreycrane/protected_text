// @flow

const DELETING = {
  initial: 'confirm',
  states: {
    confirm: {
      on: {
        OK: 'deleting',
        CANCEL: '#machine.MODIFIED',
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
        CANCEL: '#machine.MODIFIED',
      },
    },
  },
};

export default DELETING;
