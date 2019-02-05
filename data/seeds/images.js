
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('images').delete()
    .then(function () {
      // Inserts seed entries
      return knex('images').insert([
        {id: 1, url: 'https://www.qualiscare.com/wp-content/uploads/2017/08/default-user.png'}
      ]);
    });
};
