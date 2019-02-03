const request = require('supertest');
const knex = require('knex');
const bcrypt = require('bcrypt');

const config = require('../knexfile');
const server = require('../server');

const db = knex(config.development);

describe('tools CRUD operations', () => {

  afterEach(async () => {

    await db('tools').truncate();

  });

  beforeEach(() => {
    jest.setTimeout(15000);
  });

  describe('get route', () => {

    it('should return a status code of 200 upon success', async (done) => {

      const response = await request(server).get('/api/tools');

      expect(response.status).toBe(200);

      done();

    });

    it('should return an array of tools', async () => {

      const response = await request(server).get('/api/tools');

      expect(Array.isArray(response.body)).toBe(true);

    });

  });

  describe('post route', () => {

    let token;

    beforeEach(() => {

      const resp = await request(server).post('/api/registration/register', {
        username: 'user123',
        password: 'pass',
        image_id: 0,
        email: 'test@test.test',
        firstname: 'test',
        lastname: 'test'
      });

      token = resp.body.token;

    });

    afterEach(() => {

      db('users').truncate();

    });

    it('should return status code of 200 upon success', async () => {

      const response = await request(server).post('/api/tools/').send({
        name: 'name',
        category: 'cool stuff',
        address: '123 sesame street',
        owner_id: 1,
        description: 'a cool product',
        dailyCost: 3.25,
        deposit: 15
      }).set('Authorization', token);

      expect(response.status).toBe(200);

    });

    it('should return status code of 400 if body is invalid', async () => {

      const response = await request(server).post('/api/tools').send({
        naame: 'name',
        catfegory: 'cool stuff',
        address: '123 sesame street',
        owner_id: 1,
        description: 'a cool product',
        dailyCost: 3.25,
        deposit: 15
      }).set('Authorization', token);

      expect(response.status).toBe(400);

    });

    it('should return status code of 401 if not logged in', async () => {

      const response = await request(server).post('/api/tools/').send({
        name: 'name',
        category: 'cool stuff',
        address: '123 sesame street',
        owner_id: 1,
        description: 'a cool product',
        dailyCost: 3.25,
        deposit: 15
      });

      expect(response.status).toBe(401);

    });

  });

});
