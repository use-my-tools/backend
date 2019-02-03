const express = require('express');
const cloudinary = require('cloudinary');
const knex = require('knex');

const knexConfig = require('../knexfile');
const environment = process.env.ENVIRONMENT || 'development';
const db = knex(knexConfig[environment]);

const server = express.Router();

cloudinary.config({
  cloud_name: 'dhiayflin',
  api_key: '266536395857977',
  api_secret: 'nKC01YmIE-tSDADn4YdxiSYpj1Q'
});

server.post('/image', (req, res) => {

  cloudinary.v2.uploader.upload(
  req.files.myImage.path,
  function(error, result) {
    if (error) {

      res.status(500).json({message: 'Upload failed'});

    }
    else {

      const [ id ] = db.insert({ url: result.url}).into('images');

      res.status(201).json({ id });

    }
  });

});

module.exports = server;
