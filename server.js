const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const registration = require('./registration');
const upload = require('./upload');
const tools = require('./tools');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.use('/api/registration', registration);
server.use('/api/upload', upload);
server.use('/api/tools', tools);

module.exports = server;
