const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');

const knexConfig = require('../knexfile');
const { authenticate } = require('../common/authentication');

const environment = process.env.ENVIRONMENT || 'development';

const server = express.Router();
const db = knex(knexConfig[environment]);

server.get('/', async (req, res) => {

  try {

    const tools = await db.select().from('tools');
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

    await db.insert({
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

    res.status(201).json({message: 'created'});

  }

  catch (err) {

    console.log(err);
    res.status(500).json({message: 'internal error'});

  }

});

module.exports = server;
