
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tool_images').delete()
    .then(function () {
      // Inserts seed entries
      return knex('tool_images').insert([
        {tool_id: 1, img_id: 2},
        {tool_id: 2, img_id: 3},
        {tool_id: 3, img_id: 4},
        {tool_id: 4, img_id: 2},
        {tool_id: 5, img_id: 3},
        {tool_id: 6, img_id: 4},
        {tool_id: 7, img_id: 2},
        {tool_id: 8, img_id: 3},
        {tool_id: 9, img_id: 4},
        {tool_id: 10, img_id: 2},
        {tool_id: 11, img_id: 3},
        {tool_id: 12, img_id: 4},
        {tool_id: 13, img_id: 2},
        {tool_id: 14, img_id: 3},
        {tool_id: 15, img_id: 4},
        {tool_id: 16, img_id: 4},
      ]);
    });
};
