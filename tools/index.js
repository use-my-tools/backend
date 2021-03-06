const express = require('express');
const mailer = require('nodemailer');

const { authenticate } = require('../common/authentication');
const db = require('../data/db');

const server = express.Router();

const returnAllTools = async (req, res) => {

  try {

    let tools = await db.select().from('tools').orderBy('id', 'desc').where('owner_id', req.decoded.user.id);

    const results = tools.map(async (tool) => {

      const images = await db.select('i.url').from('tool_images as ti').join('images as i', 'ti.img_id', 'i.id').where({tool_id: tool.id});
      tool.images = images;

      return tool;

    });

    Promise.all(results).then(completed => {
      tools = completed;
      res.status(200).json(tools);
    });

  }

  catch (err) {

    console.log(err);
    res.status(500).json({message: err.message});

  }

}

server.get('/rented', authenticate, async (req, res) => {

  try {

    let tools = await db.select().from('tools').where({rented_by: req.decoded.user.id});

    const results = tools.map(async (tool) => {

      const images = await db.select('i.url').from('tool_images as ti').join('images as i', 'ti.img_id', 'i.id').where({tool_id: tool.id});
      tool.images = images;

      return tool;

    });

    Promise.all(results).then(completed => {
      tools = completed;
      res.status(200).json(tools);
    });

  }

  catch (err) {

    res.status(500).json({message: 'Internal error'});

  }

});

server.get('/', async (req, res) => {

  const count = req.query.count || 10;
  const page = req.query.page || 1;
  const name = req.query.name;

  try {

    //const tools = await db.select('t.*', 'i.url').from('tools as t').join('tool_images as ti', 'ti.tool_id', 't.id').join('images as i', 'ti.img_id', 'i.id').paginate(count, page, true);
    let tools;

    if (!name)
      tools = await db.select().from('tools').orderBy('id', 'desc').paginate(count, page, true);

    else
      tools = await db.select().from('tools').orderBy('id', 'desc').where('name', 'like', `%${name}%`).paginate(count, page, true);

    tools.currentPage = Number(tools.currentPage);

    const results = tools.data.map(async (tool) => {

      const images = await db.select('i.url').from('tool_images as ti').join('images as i', 'ti.img_id', 'i.id').where({tool_id: tool.id});
      tool.images = images;

      return tool;

    });

    Promise.all(results).then(completed => {
      tools.data = completed;
      res.status(200).json(tools);
    });

  }

  catch (err) {

    res.status(500).json({message: 'internal server error'});

  }

});

server.get('/user/:id', async (req, res) => {

  const { id } = req.params;

  try {

    const user = await db.select().from('users').where({ id }).first();

    if (!user) {

      res.status(404).json({message: 'User not found!'});
      return;

    }

    const tools = await db.select().from('tools').orderBy('id', 'desc').where('owner_id', id);

    const results = tools.map(async (tool) => {

      const images = await db.select('i.url').from('tool_images as ti').join('images as i', 'ti.img_id', 'i.id').where({tool_id: tool.id});
      tool.images = images;

      return tool;

    });

    Promise.all(results).then(completed => {
      tools.data = completed;
      res.status(200).json(tools);
    });

  }

  catch (err) {

    console.log(err);
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

    returnAllTools(req, res);

  }

  catch (err) {

    console.log(err);
    res.status(500).json({message: err.message});

  }

});

server.post('/:id/rent', authenticate, async (req, res) => {

  const { id } = req.params;

  try {

    let tool = await db.select().from('tools').where({ id }).first();

    if (!tool) {

      res.status(404).json({message: 'Tool not found!'});
      return;

    }

    if (!tool.isAvailable) {

      res.status(400).json({message: 'That tool is already being rented by someone'});
      return;

    }

    await db.update({isAvailable: false, rented_by: req.decoded.user.id}).from('tools').where({ id });

    const toolOwner = await db.select().from('users').where({id: tool.owner_id}).first();
    const requesting = await db.select().from('users').where({id: req.decoded.user.id}).first();

    const smtpTransport = mailer.createTransport({
      service: "Gmail",
      auth: {
          user: "usemytoolsemailer@gmail.com",
          pass: "usemytools42069"
      }
    });

    var mail = {
        from: "Use My Tools <usemytoolsemailer@gmail.com>",
        to: toolOwner.email,
        subject: "Someone's renting your tool",
        text: `Hey there ${toolOwner.firstname}! A user is trying to rent your ${tool.name}. Here is their information: username: ${requesting.username} email: ${requesting.email}`
    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
            res.status(500).json({message: 'Email did not send'});
        }else{
            console.log("Message sent!");
        }

        smtpTransport.close();
    });

    tool = await db.select().from('tools').where({ id }).first();

    const images = await db.select('i.url').from('tool_images as ti').join('images as i', 'ti.img_id', 'i.id').where({tool_id: id});
    tool.images = images;

    res.status(200).json(tool);

  }

  catch (err) {

    res.status(500).json({message: 'Internal error'});

  }

});

server.post('/:id/return', authenticate, async (req, res) => {

  const { id } = req.params;

  try {

    let tool = await db.select().from('tools').where({ id }).first();

    if (!tool) {

      res.status(404).json({message: 'Tool not found!'});
      return;

    }

    if (tool.rented_by !== req.decoded.user.id) {

      res.status(403).json({message: 'You are not renting that tool!'});
      return;

    }

    await db.update({rented_by: null, isAvailable: true}).from('tools').where({ id });

    let tools = await db.select().from('tools').where({rented_by: req.decoded.user.id});

    const results = tools.map(async (tool) => {

      const images = await db.select('i.url').from('tool_images as ti').join('images as i', 'ti.img_id', 'i.id').where({tool_id: tool.id});
      tool.images = images;

      return tool;

    });

    Promise.all(results).then(completed => {
      tools = completed;
      res.status(200).json(tools);
    });

  }

  catch (err) {

    res.status(500).json({message: 'Internal error'});

  }

});

server.delete('/:id', authenticate, async (req, res) => {

  const { id } = req.params;
  const user_id = req.decoded.user.id;

  try {

    const exists = await db.select().from('tools').where({ id }).first();

    if (!exists) {

      res.status(404).json({message: 'tool doesnt exist'});
      return;

    }

    console.log('test');

    console.log(req.decoded);

    console.log('USERID',req.decoded.user.id);

    if (exists.owner_id !== user_id) {

      res.status(403).json({message: `You cannot delete someone elses tool. Your id: ${user_id} their id: ${exists.owner_id}`});
      return;

    }

    await db.delete().from('tool_images').where({tool_id: id});
    await db.delete().from('tools').where({ id });

    console.log('before tool return');

    returnAllTools(req, res);

  }

  catch (err) {

    console.log(err.message);
    res.status(500).json({message: err.message});

  }

});

server.put('/:id', authenticate, async (req, res) => {

  const { id } = req.params;
  const user_id = req.decoded.subject;

  let { name, brand, category, address, description, dailyCost, deposit } = req.body;

  try {

    const tool = await db.select().from('tools').where({ id }).first();

    if (!tool) {

      res.status(404).json({message: 'Tool does not exist'});
      return;

    }

    if (!name && !brand && !category && !address && !description && !dailyCost && !deposit) {

      res.status(400).json({message: 'No body provided!'});
      return;

    }

    if (!name) {

      name = tool.name;

    }

    if (!brand) {

      brand = tool.brand;

    }

    if (!category) {

      category = tool.category;

    }

    if (!address) {

      address = tool.address;

    }

    if (!description) {

      description = tool.description;

    }

    if (!dailyCost) {

      dailyCost = tool.dailyCost;

    }

    if (!deposit) {

      deposit = tool.deposit;

    }

    if (user_id !== tool.owner_id) {

      res.status(403).json({message: 'You cannot edit someone elses tool'});
      return;

    }

    await db.update({ name, brand, category, address, description, dailyCost, deposit }).from('tools').where({ id });

    returnAllTools(req, res);

  }

  catch (err) {

    console.log(err);
    res.status(500).json({message: 'internal error'});

  }

});

module.exports = server;
