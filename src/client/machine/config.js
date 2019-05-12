// @flow

import { assign } from 'xstate';

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

const config = {
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
};

export default config;
