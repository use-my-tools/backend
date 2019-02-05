
exports.up = function(knex, Promise) {
  return knex.schema.createTable('reviews', tbl => {

    tbl.increments();

    tbl.integer('stars').notNullable();
    tbl.string('review');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('reviews');
};
