
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_reviews', tbl => {

    tbl.integer('user_id').notNullable().references('id').inTable('users');
    tbl.integer('review_id').notNullable().references('id').inTable('reviews');

    tbl.primary(['user_id', 'review_id']);

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_reviews');
};
