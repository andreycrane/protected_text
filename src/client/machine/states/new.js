// @flow

import { assign } from 'xstate';

const NEW = {
  on: {
    NEW_NOTE: {
      actions: 'newNote',
    },
    REMOVE_NOTE: {
      actions: 'removeNote',
    },
    UPDATE_NOTE: {
      actions: 'updateNote',
    },
    CHANGE_CURRENT: {
      actions: 'changeCurrent',
    },
    SAVE: {
      target: '#machine.CREATE_PASSWORD',
      actions: [
        assign({
          prevState: 'NEW',
        }),
      ],
    },
  },
};

export default NEW;
