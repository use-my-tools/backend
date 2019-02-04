
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tool_images', tbl => {

    tbl.integer('tool_id').notNullable().references('id').inTable('tools');
    tbl.integer('img_id').notNullable().references('id').inTable('images');

    tbl.primary(['tool_id', 'img_id']);

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tool_images');
};
