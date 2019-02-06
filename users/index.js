const express = require('express');
const bcrypt = require('bcrypt');

const { authenticate } = require('../common/authentication');
const db = require('../data/db');

const server = express.Router();

returnAllUsers = async res => {

  let users = await db.select('u.firstname', 'u.lastname', 'u.id', 'u.username', 'i.url').from('users as u').join('images as i', 'i.id', 'u.image_id').paginate(10, 1, true);

  const results = users.data.map(async (user) => {

    const reviews = await db.select().from('reviews').where({ for_user: user.id });

    user.reviews = reviews;
    user.stars = 0.0 + reviews.reduce((acc, val) => acc += val.stars, 0) / reviews.length || 0;

    return user;

  });

  Promise.all(results).then(completed => {
    users.data = completed;
    res.status(200).json(users);
  });

}

server.get('/', authenticate, async (req, res) => {

  const count = req.query.count || 10;
  const page = req.query.page || 1;

  try {

    returnAllUsers(res);

  }

  catch(err) {

    console.log(err);
    res.status(500).json({message: 'Internal server error'});

  }

});

server.get('/:id', authenticate, async (req, res) => {

  const { id } = req.params;

  try {

    const user = await db.select('u.firstname', 'u.lastname', 'u.id', 'u.username', 'i.url').from('users as u').join('images as i', 'i.id', 'u.image_id').where('u.id', id).first();

    if (!user) {

      res.status(404).json({message: 'User does not exist'});
      return;

    }

    const reviews = await db.select().from('reviews').where({ for_user: user.id });

    user.reviews = reviews;
    user.stars = 0.0 + reviews.reduce((acc, val) => acc += val.stars, 0) / reviews.length || 0;

    res.status(200).json(user);

  }

  catch(err) {

    res.status(500).json({message: 'Internal server error'});

  }

});

server.put('/:id', authenticate, async (req, res) => {

  const { id } = req.params;
  const { image_id, password } = req.body;

  if (!image_id && !password) {

    res.status(400).json({message: 'No data provided'});
    return;

  }

  try {

    const user = await db.select('u.firstname', 'u.lastname', 'u.id', 'u.username', 'i.url').from('users as u').join('images as i', 'i.id', 'u.image_id').where('u.id', id).first();

    if (!user) {

      res.status(404).json({message: 'User does not exist'});
      return;

    }

    if (user.id !== decoded.subject) {

      res.status(403).json({message: 'You cannot modify another users data'});
      return;

    }

    if (image_id)
      await db.update({ image_id }).from('users').where({ id });

    if (password) {

      const hashed = await bcrypt.hash(password, 1);
      await db.update({ password: hashed }).from('users').where({ id });

    }

    returnAllUsers(res);

  }

  catch(err) {

    res.status(500).json({message: 'Internal server error'});

  }

});

module.exports = server;
