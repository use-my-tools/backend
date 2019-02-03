const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const registration = require('./registration');
const upload = require('./upload');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.use('/api/registration', registration);
server.use('/api/upload', upload);

module.exports = server;
