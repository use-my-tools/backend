
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tools').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('tools').insert([
        {name: 'tool 1',
        brand,
        category,
        address,
        owner_id,
        description,
        dailyCost,
        deposit,
        isAvailable: true,
        rating: 0.0}
      ]);
    });
};
