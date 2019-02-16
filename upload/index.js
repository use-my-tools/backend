const express = require('express');
const cloudinary = require('cloudinary');
const multipart = require("connect-multiparty")();

const db = require('../data/db');

const server = express.Router();

cloudinary.config({
  cloud_name: 'dhiayflin',
  api_key: '266536395857977',
  api_secret: 'nKC01YmIE-tSDADn4YdxiSYpj1Q'
});

server.post('/image', multipart, (req, res) => {

  const { tool_id } = req.body;

  cloudinary.v2.uploader.upload(
  req.files.image.path,
  async function(error, result) {
    if (error) {

      res.status(500).json({message: 'Upload failed'});

    }
    else {

      try {

        if (!tool_id) {

          await db.insert({ url: result.url}).into('images');

          const image = await db.select().from('images').where('url', result.url).first();

          res.status(201).json({ id: image.id });

        }

        else {

          await db.insert({ url: result.url}).into('images');

          const image = await db.select().from('images').where('url', result.url).first();

          console.log(image.id);

          await db.insert({img_id: image.id, tool_id}).into('tool_images');

          res.status(201).json({ id: image.id });

        }

      }

      catch (err) {

        console.log(err);
        res.status(500).json({message: err});

      }

    }
  });

});

module.exports = server;
