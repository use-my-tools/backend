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

  cloudinary.v2.uploader.upload(
  req.files.image.path,
  async function(error, result) {
    if (error) {

      res.status(500).json({message: 'Upload failed'});

    }
    else {

      const [id] = await db.insert({ url: result.url}).into('images');

      res.status(201).json({ id });

    }
  });

});

module.exports = server;
