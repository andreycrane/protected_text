// @flow

import INITIAL from './initial';
import ENCRYPTED from './encrypted';
import FREE from './free';
import SAVED from './saved';
import NEW from './new';
import MODIFIED from './modified';
import SAVING from './saving';
import CHANGE_PASSWORD from './change_password';
import CREATE_PASSWORD from './create_password';
import DELETING from './deleting';

const states = {
  INITIAL,
  ENCRYPTED,
  FREE,
  SAVED,
  NEW,
  MODIFIED,
  SAVING,
  CHANGE_PASSWORD,
  CREATE_PASSWORD,
  DELETING,
  EXIT: { type: 'final' },
};


export default states;
