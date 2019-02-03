const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');

const knexConfig = require('../knexfile');
const { generateToken } = require('../common/authentication');

const environment = process.env.ENVIRONMENT || 'development';

const server = express.Router();
const db = knex(knexConfig[environment]);

server.post('/register', async (req, res) => {

  let { username, password, email, image_id, firstname, lastname } = req.body;

  if (!username) {

    res.status(400).json({message: 'no username provided'});
    return;

  }

  if (!password) {

    res.status(400).json({message: 'no password provided'});
    return;

  }

  if (!firstname) {

    res.status(400).json({message: 'no first name provided'});
    return;

  }

  if (!lastname) {

    res.status(400).json({message: 'no last name provided'});
    return;

  }

  if (!email) {

    res.status(400).json({message: 'no email provided'});
    return;

  }

  if (!image_id) {

    image_id = 1;

  }

  try {

    password = await bcrypt.hash(password, 1);

    const [ id ] = await db.insert({ username, password, email, image_id, firstname, lastname }).into('users');
    const user = await db.select('u.username', 'u.id as user_id', 'u.firstname', 'u.lastname', 'i.url as image_url').from('users as u').join('images as i', 'u.image_id', '=', 'i.id').where('u.id', id).first();
    const token = await generateToken(user);

    res.status(201).json({
      username: user.username,
      user_id: user.user_id,
      image_url: user.image_url,
      token
    });

  }

  catch (err) {

    const withName = await db.select().from('users').where({ username }).first();
    const withEmail = await db.select().from('users').where({ email }).first();

    if (withName || withEmail) {

      res.status(400).json({duplicateUser: withName !== undefined, duplicateEmail: withEmail !== undefined});

    }

    else {

      res.status(500).json({message: 'internal server error'});

    }

  }

});

server.post('/login', async (req, res) => {

  const { username, password } = req.body;

  if (!username) {

    res.status(400).json({message: 'no username provided'});
    return;

  }

  if (!password) {

    res.status(400).json({message: 'no password provided'});
    return;

  }

  try {

    const user = await db.select('u.username', 'u.password', 'u.id as user_id', 'u.firstname', 'u.lastname', 'i.url as image_url').from('users as u').join('images as i', 'u.image_id', '=', 'i.id').where('u.username', username).first();

    if (user) {

      const correct = await bcrypt.compare(password, user.password);

      if (correct) {

        const token = await generateToken(user);

        res.status(200).json({
          user_id: user.user_id,
          username: user.username,
          image_url: user.image_url,
          token
        });

      }

    }

    res.status(401).json({message: 'Invalid credentials'});

  }

  catch (err) {
    console.log(err);
    res.status(500);

  }

});

module.exports = server;
