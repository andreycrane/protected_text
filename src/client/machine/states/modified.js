// @flow

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
      { target: 'SAVING', cond: 'hasPassword' },
      { target: 'CREATE_PASSWORD' },
    ],
    CHANGE_PASSWORD: {
      target: 'CHANGE_PASSWORD',
      cond: 'hasPassword',
    },
    DELETE: '#machine.DELETING',
  },
};

export default MODIFIED;
