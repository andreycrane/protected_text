import { interpret, State } from 'xstate';
import { random } from 'faker';

import machine from '../machine';
import initContext from '../context';

describe('machine#FREE state', () => {
  it('moves to NEW on CREATE_EMPTY', (done) => {
    const id = random.uuid();
    const context = initContext(id);
    const FreeState = State.create({
      value: 'FREE',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('NEW')) {
          expect(state.context).toMatchObject({
            id,
            encrypted: null,
            password: null,
          });
          expect(state.context).toHaveProperty('notes');
          expect(state.context.notes).toHaveLength(1);
          done();
        }
      })
      .start(FreeState)
      .send('CREATE_EMPTY');
  });

  it('moves to EXIT on CANCEL', (done) => {
    const context = initContext('site_name');
    const FreeState = State.create({
      value: 'FREE',
      context,
    });

    interpret(machine)
      .onTransition((state) => {
        if (state.matches('EXIT')) {
          done();
        }
      })
      .start(FreeState)
      .send('CANCEL');
  });
});
