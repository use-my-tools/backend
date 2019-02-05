
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('images').delete()
    .then(function () {
      // Inserts seed entries
      return knex('images').insert([
        {id: 1, url: 'https://www.qualiscare.com/wp-content/uploads/2017/08/default-user.png'},
        {id: 2, url: 'https://www.wildetool.com/wp-content/uploads/2017/02/085432002112.png'},
        {id: 3, url: 'https://cdn.shopify.com/s/files/1/1996/9367/products/910053_800x.jpg'},
        {id: 4, url: 'https://www.aerospecialties.com/app/uploads/2017/05/RBI9900TM-and-RBA2-isolated_01.jpg'},
      ]);
    });
};
