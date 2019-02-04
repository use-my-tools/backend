const express = require('express');

const { authenticate } = require('../common/authentication');
const db = require('../data/db');

const server = express.Router();

server.get('/', async (req, res) => {

  const count = req.query.count || 10;
  const page = req.query.page || 1;

  try {

    const tools = await db.select().from('tools').paginate(count, page, true);
    res.status(200).json(tools);

  }

  catch (err) {

    res.status(500).json({message: 'internal server error'});

  }

});

server.get('/:id', async (req, res) => {

  const { id } = req.params;

  try {

    const tool = await db.select().from('tools').where({ id }).first();

    if (!tool) {

      res.status(404).json({message: 'that tool does not exist'});
      return;

    }

    res.status(200).json(tool);

  }

  catch (err) {

    res.status(500).json({message: 'internal server error'});

  }

});

server.post('/', authenticate, async (req, res) => {

  const { name, brand, category, address, owner_id, description, dailyCost, deposit } = req.body;

  if (!name) {

    res.status(400).json({message: 'no name provided!'});
    return;

  }

  if (!address) {

    res.status(400).json({message: 'no address provided!'});
    return;

  }

  if (!owner_id) {

    res.status(400).json({message: 'no owner id provided!'});
    return;

  }

  if (!deposit) {

    res.status(400).json({message: 'no deposit provided!'});
    return;

  }

  try {

    const [id] = await db.insert({
      name,
      brand,
      category,
      address,
      owner_id,
      description,
      dailyCost,
      deposit,
      isAvailable: true,
      rating: 0.0
    }).into('tools');

    const tool = await db.select().from('tools').where({ id }).first();

    res.status(201).json(tool);

  }

  catch (err) {

    console.log(err);
    res.status(500).json({message: 'internal error'});

  }

});

module.exports = server;
