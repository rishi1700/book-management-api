"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("books", [
      {
        title: "1984",
        author: "George Orwell",
        published_date: "1949-06-08",
        genre: "Dystopian",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        published_date: "1960-07-11",
        genre: "Fiction",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        published_date: "1925-04-10",
        genre: "Classic",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("books", null, {});
  },
};
