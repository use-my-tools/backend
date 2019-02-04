const request = require('supertest');
const knex = require('knex');

const server = require('../server');
const db = require('../data/db');

describe('users endpoints', () => {

  describe('put route', () => {

    let token;

    beforeEach(async () => {

      const data = await request(server).post('/api/registration/register').send({
        username: 'user',
        email: 'email',
        firstname: 'name',
        lastname: 'name2',
        password: 'pass',
        image_id: 1
      });

      token = data.response.token;

    });

    afterEach(async () => {

      await db('users').truncate();

    });

    it('should update user image', async () => {

      const response = request(server).put('/api/users/1').send({
        image_id: 2
      }).set('Authorization', token);

    });

  });

});
