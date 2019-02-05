// Update with your config settings.
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/db.sqlite3'
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: 'postgres://uqdgfnmjjnzlxr:a393425c2d101d92cad460ba2b0fc0ed534aa61becf34a1209c9fc5bc5767252@ec2-107-21-99-237.compute-1.amazonaws.com:5432/damliqtl2i3jg6',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/migrations'
    }
  }

};
