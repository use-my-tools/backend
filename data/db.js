const knex = require('knex');
const paginator = require('knex-paginator');

const knexConfig = require('../knexfile');
const environment = process.env.ENVIRONMENT || 'production';

const db = knex(knexConfig[environment]);

paginator(db);

module.exports = db;
