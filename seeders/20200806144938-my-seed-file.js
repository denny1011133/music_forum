'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    queryInterface.bulkInsert('Categories',
      ['流行', '搖滾', '嘻哈', '爵士', '古典', '鄉村', '獨立']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
    return queryInterface.bulkInsert('Albums',
      Array.from({ length: 50 }).map(d =>
        ({
          name: faker.name.findName(),
          date: "2020-06-07",
          artist: faker.name.findName(),
          company: faker.company.companyName(),
          image: faker.image.imageUrl(),
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
          CategoryId: Math.floor(Math.random() * 5) + 1
        })
      ), {});
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Categories', null, {});
    return queryInterface.bulkDelete('Albums', null, {});
  }
};
