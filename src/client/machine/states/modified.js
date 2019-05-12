// @flow

import { assign } from 'xstate';

const MODIFIED = {
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
    SAVE: [
      {
        target: 'SAVING',
        cond: 'hasPassword',
        actions: [
          assign({
            prevState: 'MODIFIED',
          }),
        ],
      },
      {
        target: 'CREATE_PASSWORD',
        actions: [
          assign({
            prevState: 'MODIFIED',
          }),
        ],
      },
    ],
    CHANGE_PASSWORD: {
      target: '#machine.CHANGE_PASSWORD',
      cond: 'hasPassword',
      actions: [
        assign({
          prevState: 'MODIFIED',
        }),
      ],
    },
    DELETE: {
      target: '#machine.DELETING',
      actions: [
        assign({
          prevState: 'MODIFIED',
        }),
      ],
    },
  },
};

export default MODIFIED;
