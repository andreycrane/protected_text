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
      .get(`/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        { id, data: null },
        done,
      );
  });

  it('returns data=\'data\' if key exists', async () => {
    const id = random.uuid();
    const data = {
      [random.objectElement()]: random.uuid(),
    };

    this.db.set(id, data);

    return request(this.app)
      .get(`/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        { id, data },
      );
  });

  it('stores data by certain key', async () => {
    const id = random.uuid();
    const data = {
      [random.objectElement()]: random.uuid(),
    };

    return request(this.app)
      .post(`/id/${id}`)
      .send(data)
      .expect('Content-Type', /json/)
      .expect(
        200,
        { id, data },
      );
  });

  it('returns recently saved data', async () => {
    const id = random.uuid();
    const data = {
      [random.objectElement()]: random.uuid(),
    };

    await request(this.app)
      .post(`/id/${id}`)
      .send(data)
      .expect('Content-Type', /json/)
      .expect(
        200,
        { id, data },
      );

    return request(this.app)
      .get(`/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        { id, data },
      );
  });

  it('removes recently stored data', async () => {
    const id = random.uuid();
    const data = {
      [random.objectElement()]: random.uuid(),
    };

    await request(this.app)
      .post(`/id/${id}`)
      .send(data)
      .expect('Content-Type', /json/)
      .expect(
        200,
        { id, data },
      );

    await request(this.app)
      .get(`/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        { id, data },
      );

    await request(this.app)
      .delete(`/id/${id}`)
      .expect('Content-Type', /json/)
      .expect(
        200,
        { id, data: null },
      );
  });
});
