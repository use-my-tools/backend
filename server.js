const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const registration = require('./registration');
const upload = require('./upload');
const tools = require('./tools');
const users = require('./users');
const reviews = require('./reviews');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.use('/api/registration', registration);
server.use('/api/upload', upload);
server.use('/api/tools', tools);
server.use('/api/users', users);
server.use('/api/reviews', reviews);

module.exports = server;
