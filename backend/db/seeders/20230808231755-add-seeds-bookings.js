"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Bookings";
const { Booking } = require("../models");
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          startDate: new Date("2023-12-24"),
          endDate: new Date("2024-1-18"),
        },
        {
          spotId: 2,
          userId: 2,
          startDate: new Date("2023-11-15"),
          endDate: new Date("2023-12-5"),
        },
        {
          spotId: 3,
          userId: 3,
          startDate: new Date("2024-1-24"),
          endDate: new Date("2024-1-26"),
        },
        {
          spotId: 4,
          userId: 4,
          startDate: new Date("2023-07-31"),
          endDate: new Date("2023-11-25"),
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
        [Op.in]: [1, 2, 3, 4],
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
