const express = require('express');

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

server.post('/', authenticate, async (req, res) => {

  const { review, stars, for_user } = req.body;

  const by_user = req.decoded.user.id;

  if (!stars || stars < 1 || stars > 5) {

    res.status(400).json({message: 'You need to give 1-5 stars'});
    return;

  }

  if (!for_user) {

    res.status(400).json({message: 'You need to specify who the review is for.'});
    return;

  }

  try {

    const prevReview = await db.select().from('reviews').where({ for_user, by_user }).first();

    if (prevReview) {

      res.status(405).json({message: 'You have already written a review for that user'});
      return;

    }

    await db.insert({ review, stars, for_user, by_user }).into('reviews');

    returnAllUsers(res);

  }

  catch (err) {

    res.status(500).json({message: 'Internal error'});

  }

});

module.exports = server;
