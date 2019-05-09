import request from 'supertest';
import { random } from 'faker';
import { prodApp } from './application';

describe('server#application', function () {
  beforeAll(() => {
    this.namespace = random.uuid();
    this.store = new Map();
    const { app, db } = prodApp({
      dbConnParams: [
        {
          namespace: this.namespace,
          store: this.store,
        },
      ],
      logger: (error, req, res, next) => next(),
    });

    this.app = app;
    this.db = db;
  });

  beforeEach(async () => {
    await this.db.clear();
  });

  it('returns encrypted=null if key doesn\'t exist', (done) => {
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

  it('returns encrypted=\'data\' if key exists', async () => {
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

  it('returns 200 if accepts unrecognized url', async () => {
    await request(this.app)
      .get('/id/lol/test')
      .expect(200);
  });

  it('throws an error if data size more than 5kb', async () => {
    const len = 6 * 1024;
    const id = random.uuid();
    const encrypted = new Array(len + 1).join('-');

    await request(this.app)
      .post(`/api/id/${id}`)
      .send({ encrypted })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        const { body } = res;

        expect(Array.isArray(body)).toBe(true);
        expect(body).toHaveLength(2);
        expect(body[0]).toHaveProperty('type', 'entity.too.large');
        expect(body[1]).toBeNull();
      });
  });
});
