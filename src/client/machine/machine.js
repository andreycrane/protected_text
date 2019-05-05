// @flow

import {
  Machine,
  assign,
  send,
} from 'xstate'; // or use your own interpreter!

import {
  createFromDecryptedAction,
  createEmptyAction,
  closeAction,
  idleEntryAction,

  newNoteAction,
  removeNoteAction,
  updateNoteAction,

  changeCurrentAction,

  setPasswordAction,
} from './actions';

import {
  wasSiteCreated,
  wasSiteFree,
  wasSiteDecrypted,

  hasPassword,
  canSetPassword,
} from './guards';

import {
  getSiteService,
  postSiteService,
  deleteSiteService,
  decryptService,
} from './services';

import initContext from './context';

const machine = Machine(
  {
    strict: true,
    id: 'machine',
    initial: 'INITIAL',
    context: initContext('site_name'),
    states: {
      INITIAL: {
        initial: 'get_site',
        states: {
          get_site: {
            invoke: {
              src: 'getSite',
              onDone: {
                target: 'success',
                actions: assign((ctx, event): TContext => ({ ...ctx, ...event.data })),
              },
              onError: 'error',
            },
          },
          success: {
            on: {
              '': [
                { target: '#machine.ENCRYPTED', cond: 'wasSiteCreated' },
                { target: '#machine.FREE', cond: 'wasSiteFree' },
              ],
            },
          },
          error: {
            on: {
              REPEAT: 'get_site',
              CANCEL: '#machine.EXIT',
            },
          },
        },
      },
      ENCRYPTED: {
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
                target: '#machine.IDLE',
                cond: 'wasSiteDecrypted',
              },
            },
          },
        },
      },
      FREE: {
        on: {
          CREATE_EMPTY: {
            actions: ['createEmpty', send('GO_IDLE')],
          },
          GO_IDLE: {
            target: 'IDLE',
            cond: 'wasSiteDecrypted',
          },
          CANCEL: '#machine.EXIT',
        },
      },
      IDLE: {
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
          },
        },
      },
      MODIFIED: {
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
        },
      },
      SAVING: {
        initial: 'saving',
        states: {
          saving: {
            invoke: {
              id: 'saving',
              src: 'postSite',
              onDone: '#machine.IDLE',
              onError: 'error',
            },
          },
          error: {
            on: {
              REPEAT: 'saving',
              CANCEL: '#machine.MODIFIED',
            },
          },
        },
      },
      CHANGE_PASSWORD: {
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
              CANCEL: {
                target: '#machine.MODIFIED',
              },
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
              CANCEL: {
                target: '#machine.MODIFIED',
              },
            },
          },
        },
      },
      CREATE_PASSWORD: {
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
      },
      DELETING: {
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
      },
      EXIT: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      createFromDecrypted: assign(createFromDecryptedAction),
      createEmpty: assign(createEmptyAction),
      close: closeAction,
      idleEntry: idleEntryAction,

      newNote: assign(newNoteAction),
      removeNote: assign(removeNoteAction),
      updateNote: assign(updateNoteAction),

      changeCurrent: assign(changeCurrentAction),
      setPassword: assign(setPasswordAction),
    },
    guards: {
      wasSiteCreated,
      wasSiteFree,
      wasSiteDecrypted,
      hasPassword,
      canSetPassword,
    },
    services: {
      getSite: getSiteService,
      postSite: postSiteService,
      deleteSite: deleteSiteService,
      decrypt: decryptService,
    },
  },
);

export default machine;
