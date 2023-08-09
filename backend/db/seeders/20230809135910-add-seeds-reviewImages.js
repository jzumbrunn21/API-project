"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "ReviewImages";
const { ReviewImage } = require("../models");
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: "https://allears.net/wp-content/uploads/2021/04/wdw-2021-magic-kingdom-park-cinderella-castle-general-stock-atmosphere-3-scaled.jpg",
        },
        {
          reviewId: 2,
          url: "https://cdn.onekindesign.com/wp-content/uploads/2017/01/Contemporary-Home-Design-Vertical-Arts-Architecture-01-1-Kindesign.jpg",
        },
        {
          reviewId: 3,
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/The_Osborne_%2851396674370%29.jpg/800px-The_Osborne_%2851396674370%29.jpg",
        },
        {
          reviewId: 4,
          url: "https://cdn.onekindesign.com/wp-content/uploads/2019/01/Rustic-Mountain-Home-Berlin-Architects-01-1-Kindesign.jpg",
        },
      ],
      { validate: true }
    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        reviewId: {
          [Op.in]: [1, 2, 3, 4],
        },
      },
      {}
    );
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
