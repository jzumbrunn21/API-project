"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Reviews";
const { Review } = require("../models");
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          review:
            "It was way too hot and way too muggy and I didn't even see Mickey!",
          stars: 1,
        },
        {
          spotId: 2,
          userId: 2,
          review:
            "So clean and the owners had a cute doggo that I could pet! Thank you!",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 3,
          review:
            "The shack was amazing. I just stayed at the shack and stared at traffic on the street.",
          stars: 5,
        },
        {
          spotId: 4,
          userId: 4,
          review:
            "Honestly, I thought this was Grand Rapids, Michigan, so my wife is pretty upset at me. Beautiful room!",
          stars: 3,
        },
        {
          spotId: 5,
          userId: 1,
          review: "Love this spot!",
          stars: 3,
        },
        {
          spotId: 1,
          userId: 1,
          review: "We love Disney world!",
          stars: 5,
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
    await queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1, 2, 3, 4, 1, 5],
      },
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
