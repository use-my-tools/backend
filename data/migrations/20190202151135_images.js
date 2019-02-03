
exports.up = function(knex, Promise) {
  return knex.schema.createTable('images', tbl => {

    // primary key: id, increments
    tbl.increments();

    //other keys
    tbl.string('url').notNullable();

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('images');
};
