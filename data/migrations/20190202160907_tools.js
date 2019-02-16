
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tools', tbl => {

    tbl.increments();

    tbl.string('name').notNullable();
    tbl.string('brand');
    tbl.string('category');
    tbl.string('address').notNullable();
    tbl.integer('owner_id').notNullable();
    tbl.string('description');
    tbl.double('dailyCost');
    tbl.double('deposit').notNullable();
    tbl.boolean('isAvailable').notNullable();
    tbl.double('rating').notNullable();
    tbl.integer('rented_by');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tools');
};
