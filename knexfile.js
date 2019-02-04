// Update with your config settings.

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
    client: 'postgresql',
    connection: 'postgres://faouivfh:4k6zSdj9qBm4Sl6iUr2YhXvEtscfJcLY@stampy.db.elephantsql.com:5432/faouivfh',
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
