// @flow

import { Machine } from 'xstate';

import states from './states';
import config from './config';

import initContext from './context';

const machine = Machine(
  {
    strict: true,
    id: 'machine',
    initial: 'INITIAL',
    context: initContext('site_name'),
    states,
  },
  config,
);

export default machine;
