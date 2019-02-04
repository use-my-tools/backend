const request = require('supertest');
const knex = require('knex');
const bcrypt = require('bcrypt');

const config = require('../knexfile');
const server = require('../server');

const db = knex(config.development);

let token;

describe('tools CRUD operations', () => {

  afterEach(async () => {

    await db('tools').truncate();
    await db('users').truncate();

  });

  beforeEach(async () => {

    jest.setTimeout(15000);

    const resp = await request(server).post('/api/registration/register').send({
      username: 'user',
      email: 'email',
      firstname: 'name',
      lastname: 'name2',
      password: 'pass'
    });

    token = resp.body.token;

  });

  describe('get routes', () => {

    it('should return a status code of 200 upon success', async (done) => {

      const response = await request(server).get('/api/tools');

      expect(response.status).toBe(200);

      done();

    });

    it('should return a status code of 200 upon success for individual tool', async (done) => {

      await request(server).post('/api/tools/').send({
        name: 'name',
        category: 'cool stuff',
        address: '123 sesame street',
        owner_id: 1,
        description: 'a cool product',
        dailyCost: 3.25,
        deposit: 15
      }).set('Authorization', token);

      const response = await request(server).get('/api/tools/1');

      expect(response.status).toBe(200);

      done();

    });

    it('should return an array of tools', async () => {

      const response = await request(server).get('/api/tools');

      expect(Array.isArray(response.body.data)).toBe(true);

    });

    it('should return an object for individual tools', async () => {

      await request(server).post('/api/tools/').send({
        name: 'name',
        category: 'cool stuff',
        address: '123 sesame street',
        owner_id: 1,
        description: 'a cool product',
        dailyCost: 3.25,
        deposit: 15
      }).set('Authorization', token);

      const response = await request(server).get('/api/tools/1');

      expect(typeof response.body).toBe('object');

    });

    it('should return 404 if tool is not found', async () => {

      const response = await request(server).get('/api/tools/100');

      expect(response.status).toBe(404);

    });

  });

  describe('post route', () => {

    it('should return status code of 201 upon success', async () => {

      const response = await request(server).post('/api/tools/').send({
        name: 'name',
        category: 'cool stuff',
        address: '123 sesame street',
        owner_id: 1,
        description: 'a cool product',
        dailyCost: 3.25,
        deposit: 15
      }).set('Authorization', token);

      expect(response.status).toBe(201);

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

      console.log(response.data);

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
