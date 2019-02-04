const express = require('express');

const { authenticate } = require('../common/authentication');
const db = require('../data/db');

const server = express.Router();

server.get('/', async (req, res) => {

  const count = req.query.count || 10;
  const page = req.query.page || 1;

  try {

    //const tools = await db.select('t.*', 'i.url').from('tools as t').join('tool_images as ti', 'ti.tool_id', 't.id').join('images as i', 'ti.img_id', 'i.id').paginate(count, page, true);
    const tools = await db.select().from('tools').paginate(count, page, true);

    const results = tools.data.map(async (tool) => {

      const images = await db.select('i.url').from('tool_images as ti').join('images as i', 'ti.img_id', 'i.id').where({tool_id: tool.id});
      tool.images = images;

      return tool;

    });

    Promise.all(results).then(completed => res.status(200).json(completed));

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

    const images = await db.select('i.url').from('tool_images as ti').join('images as i', 'ti.img_id', 'i.id').where({tool_id: id});
    tool.images = images;

    res.status(200).json(tool);

  }

  catch (err) {

    console.log(err);
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

    const tool = await db.select().from('tools');

    res.status(201).json(tool);

  }

  catch (err) {

    console.log(err);
    res.status(500).json({message: 'internal error'});

  }

});

module.exports = server;
