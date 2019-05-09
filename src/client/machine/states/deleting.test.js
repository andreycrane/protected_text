import { interpret, State } from 'xstate';

import machine from '../machine';
import initContext from '../context';
import { deleteSiteService } from '../services';

jest.mock('../services', () => {
  const t = jest.requireActual('../services');
  t.getSiteService = jest.fn(async () => null);
  t.postSiteService = jest.fn(async () => null);
  t.deleteSiteService = jest.fn(async () => null);

  return t;
});

describe('machine#DELETING state', () => {
  it('moves to DELETING:confirm children state', (done) => {
    const context = initContext('site_name');
    const testMachine = machine.withContext(context);
    const DeletingState = State.create({
      value: 'DELETING',
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ DELETING: 'confirm' })) {
          done();
        }
      })
      .start(DeletingState);
  });

  it('moves from DELETING:confirm to MODIFIED on CANCEL', (done) => {
    const context = initContext('site_name');
    const testMachine = machine.withContext(context);
    const DeletingState = State.create({
      value: { DELETING: 'confirm' },
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches('MODIFIED')) {
          done();
        }
      })
      .start(DeletingState)
      .send('CANCEL');
  });

  it('moves from DELETING:confirm to DELETING:deleting on OK', (done) => {
    const context = initContext('site_name');
    const testMachine = machine.withContext(context);
    const DeletingState = State.create({
      value: { DELETING: 'confirm' },
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ DELETING: 'deleting' })) {
          done();
        }
      })
      .start(DeletingState)
      .send('OK');
  });

  it('moves from DELETING:deleting to EXIT if service resolves', (done) => {
    const context = initContext('site_name');
    const testMachine = machine.withContext(context);

    const DeletingState = State.create({
      value: 'DELETING',
      context,
    });

    deleteSiteService.mockImplementation(async () => true);

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches('EXIT')) {
          done();
        }
      })
      .start(DeletingState)
      .send('OK');
  });

  it('moves from DELETING:deleting to DELETING:error if service rejects', (done) => {
    const context = initContext('site_name');
    const testMachine = machine.withContext(context);

    const DeletingState = State.create({
      value: 'DELETING',
      context,
    });

    deleteSiteService.mockImplementation(async () => { throw new Error(); });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ DELETING: 'error' })) {
          done();
        }
      })
      .start(DeletingState)
      .send('OK');
  });

  it('moves from DELETING:error to DELETING:deleting on REPEAT', (done) => {
    const context = initContext('site_name');
    const testMachine = machine.withContext(context);

    const DeletingState = State.create({
      value: { DELETING: 'error' },
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches({ DELETING: 'deleting' })) {
          done();
        }
      })
      .start(DeletingState)
      .send('REPEAT');
  });

  it('moves from DELETING:error to MODIFIED on CANCEL', (done) => {
    const context = initContext('site_name');
    const testMachine = machine.withContext(context);

    const DeletingState = State.create({
      value: { DELETING: 'error' },
      context,
    });

    interpret(testMachine)
      .onTransition((state) => {
        if (state.matches('MODIFIED')) {
          done();
        }
      })
      .start(DeletingState)
      .send('CANCEL');
  });
});
