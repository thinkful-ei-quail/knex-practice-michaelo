require('dotenv').config();
const knex = require('knex');

const dataBase = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

console.log('Drills are running!');


function searchByName(searchTerm) {
  dataBase
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}
searchByName('fish');

function paginateProducts(page, productsPerPage) {
  const offset = productsPerPage * (page - 1);
  dataBase
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}
paginateProducts(2, 6);

function daysAfter(daysAgo) {
  dataBase
    .select('*')
    .count('date_added AS daysAgo')
    .where(
      'date_added',
      '>',
      dataBase.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    );
}
daysAfter(2);

function totalCost() {
  dataBase
    .select('category')
    .sumDistinct('price AS totalCost')
    .from('shopping_list')
    .groupBy('category')
    .then(result =>{
      console.log(result);
    });
}
totalCost();