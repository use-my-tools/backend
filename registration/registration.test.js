const request = require('supertest');
const knex = require('knex');
const bcrypt = require('bcrypt');

const config = require('../knexfile');
const server = require('../server');

const db = knex(config.development);

describe('user registration', () => {

  afterEach(async () => {

    await db('users').truncate();

  });

  describe('register route', () => {

    it('should return a status code of 201 upon success', async () => {

      const response = await request(server).post('/api/registration/register').send({
        username: 'username',
        password: 'password',
        email: 'test@test.test'
      });

      expect(response.status).toBe(201);

    });

    it('should return status code 400 if body is invalid', async () => {

      const response = await request(server).post('/api/registration/register').send({
        usernaame: 'username',
        password: 'password',
        email: 'test@test.test'
      });

      expect(response.status).toBe(400);

    });

    it('should send back user name, id, and token if registration is successful', async () => {

      const response = await request(server).post('/api/registration/register').send({
        username: 'username',
        password: 'password',
        email: 'test@test.test'
      });

      expect(response.body.user_id).not.toBe(null);
      expect(response.body.username).not.toBe(null);
      expect(response.body.token).not.toBe(null);

    });

    it('should send status of 400 and message if username or email are duplicated', async () => {

      await db.insert({
        username: 'user1',
        password: '1234',
        email: 'bigbird@whitehouse.gov',
        image_url: 'https://www.qualiscare.com/wp-content/uploads/2017/08/default-user.png'
      }).into('users');

      const response = await request(server).post('/api/registration/register').send({
        username: 'user1',
        password: '1234',
        email: 'bigbird@whitehouse.gov',
      });

      expect(response.status).toBe(400);
      expect(response.body.duplicateUser).toBe(true);
      expect(response.body.duplicateEmail).toBe(true);

    });

  });

  describe('login route', () => {

    beforeEach(async () => {

      await db.insert({
        username: 'user1',
        password: bcrypt.hashSync('pass', 2),
        email: 'bigbird@whitehouse.gov',
        image_url: 'https://www.qualiscare.com/wp-content/uploads/2017/08/default-user.png'
      });

    });

    it('should return status code of 200 upon success', async () => {

      const response = await request(server).post('/api/registration/login').send({
        username: 'user1',
        password: 'pass'
      });

      expect(response.status).toBe(200);

    });

    it('should return status code of 400 if body is invalid', async () => {

      const response = await request(server).post('/api/registration/login').send({
        usernaame: 'user1',
        password: 'pass'
      });

      expect(response.status).toBe(400);

    });

  });

});
