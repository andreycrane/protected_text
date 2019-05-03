import request from 'supertest';
import { random } from 'faker';
import createApp from './application';

describe('server#application', function () {
  beforeAll(() => {
    this.namespace = random.uuid();
    this.store = new Map();
    const { app, db } = createApp({
      connectionParams: [
        {
          namespace: this.namespace,
          store: this.store,
        },
      ],
    });

    this.app = app;
    this.db = db;
  });

  beforeEach(async () => {
    await this.db.clear();
  });

  it('returns data=null if key doesn\'t exist', (done) => {
    const id = random.uuid();
    request(this.app)
      .get(`/api/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        [null, { id, encrypted: null }],
        done,
      );
  });

  it('returns data=\'data\' if key exists', async () => {
    const id = random.uuid();
    const encrypted = random.uuid();

    this.db.set(id, encrypted);

    return request(this.app)
      .get(`/api/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        [null, { id, encrypted }],
      );
  });

  it('stores data by certain key', async () => {
    const id = random.uuid();
    const encrypted = random.uuid();

    return request(this.app)
      .post(`/api/id/${id}`)
      .send({ encrypted })
      .expect('Content-Type', /json/)
      .expect(
        200,
        [null, { id, encrypted }],
      );
  });

  it('returns recently saved data', async () => {
    const id = random.uuid();
    const encrypted = random.uuid();

    await request(this.app)
      .post(`/api/id/${id}`)
      .send({ encrypted })
      .expect('Content-Type', /json/)
      .expect(
        200,
        [null, { id, encrypted }],
      );

    return request(this.app)
      .get(`/api/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        [null, { id, encrypted }],
      );
  });

  it('removes recently stored data', async () => {
    const id = random.uuid();
    const encrypted = random.uuid();

    await request(this.app)
      .post(`/api/id/${id}`)
      .send({ encrypted })
      .expect('Content-Type', /json/)
      .expect(
        200,
        [null, { id, encrypted }],
      );

    await request(this.app)
      .get(`/api/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        [null, { id, encrypted }],
      );

    await request(this.app)
      .delete(`/api/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        [null, { id, encrypted: null }],
      );
  });

  it('returns 404 if accepts unrecognized url', async () => {
    await request(this.app)
      .get('/id/lol/test')
      .expect(
        404,
      );
  });
});
