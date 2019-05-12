// @flow

import { assign } from 'xstate';

const SAVED = {
  on: {
    NEW_NOTE: {
      target: '#machine.MODIFIED',
      actions: 'newNote',
    },
    REMOVE_NOTE: {
      target: '#machine.MODIFIED',
      actions: 'removeNote',
    },
    UPDATE_NOTE: {
      target: '#machine.MODIFIED',
      actions: 'updateNote',
    },
    CHANGE_CURRENT: {
      actions: 'changeCurrent',
    },
    CHANGE_PASSWORD: {
      target: 'CHANGE_PASSWORD',
      cond: 'hasPassword',
      actions: [
        assign({
          prevState: 'SAVED',
        }),
      ],
    },
    DELETE: {
      target: '#machine.DELETING',
      actions: [
        assign({
          prevState: 'SAVED',
        }),
      ],
    },
  },
};

export default SAVED;
