
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {

    // primary key: id
    tbl.increments();

    // other keys

    tbl.string('username').unique().notNullable();
    tbl.string('email').unique().notNullable();
    tbl.string('password').notNullable();
    tbl.string('image_url').notNullable();
    tbl.string('firstname').notNullable();
    tbl.string('lastname').notNullable();

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
