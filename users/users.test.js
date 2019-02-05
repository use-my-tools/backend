const request = require('supertest');
const knex = require('knex');

const server = require('../server');
const db = require('../data/db');

describe('users endpoints', () => {

  let token;
  let user_id;

  beforeEach(async () => {

    const data = await request(server).post('/api/registration/register').send({
      username: 'user',
      email: 'email',
      firstname: 'name',
      lastname: 'name2',
      password: 'pass',
      image_id: 1
    });

    token = data.body.token;
    user_id = data.bodyid;

  });

  afterEach(async () => {

    await db('users').truncate();

  });

  describe('get all route', () => {

    it('should return user info', async () => {

      const response = await request(server).get('/api/users').set('Authorization', token);

      expect(Array.isArray(response.body.data)).toBe(true);

    });

    it('should return 200 status code', async () => {

      const response = await request(server).get('/api/users').set('Authorization', token);

      expect(response.status).toBe(200);

    });

    it('should return 401 status code if not logged in', async () => {

      const response = await request(server).get('/api/users');

      expect(response.status).toBe(401);

    });

  });

  describe('individual get route', () => {

    it('should return user info', async () => {

      const response = await request(server).get('/api/users/1').set('Authorization', token);

      expect(typeof response.body).toBe('object');
      expect(response.body).not.toBe(null);
      expect(response.body).not.toBe(undefined);

    });

    it('should return 200 status code', async () => {

      const response = await request(server).get('/api/users/1').set('Authorization', token);

      expect(response.status).toBe(200);

    });

    it('should return 401 status code if not logged in', async () => {

      const response = await request(server).get('/api/users/1');

      expect(response.status).toBe(401);

    });

    it('should return 404 status code if not found', async () => {

      const response = await request(server).get('/api/users/123').set('Authorization', token);

      expect(response.status).toBe(404);

    });

  });

  describe('put route', () => {

    it('should update user image', async () => {

      const resp1 = await request(server).get('/api/users/' + user_id).set('Authorization', token);

      const link1 = resp1.body.url;

      await request(server).put('/api/users/' + user_id).send({
        image_id: 2
      }).set('Authorization', token);

      const response = await request(server).get('/api/users/' + user_id).set('Authorization', token);

      expect(response.body.url).toBe(link1);

    });

    it('should return 404 if not found', async () => {

      const response = await request(server).put('/api/users/232').send({
        image_id: 2
      }).set('Authorization', token);

      expect(response.status).toBe(404);

    });

    it('should return 404 if not authorized', async () => {

      const response = await request(server).put('/api/users/' + user_id).send({
        image_id: 2
      });

      expect(response.status).toBe(401);

    });

  });

});
