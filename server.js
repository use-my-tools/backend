const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const registration = require('./registration');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.use('/api/registration', registration);

module.exports = server;
