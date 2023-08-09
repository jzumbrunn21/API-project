"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Spots";
const { Spot } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "321 Vacation Lane",
          city: "Tampa",
          state: "Florida",
          country: "United States",
          lat: 27.950575,
          lng: -82.457176,
          name: "Underwater BnB Experience",
          description:
            "This elegant home simulates hurricanes and random weather changes to really get that Florida experience.",
          price: 813.0,
        },
        {
          ownerId: 2,
          address: "987 Mountain Vacation Drive",
          city: "Knoxville",
          state: "Tennessee",
          country: "United States",
          lat: 35.960636,
          lng: -83.920738,
          name: "Mountain Getaway",
          description:
            "Nestled right next to Dolly's hair collection, this quiet abode offers sweet views and a sick themepark nearby.",
          price: 865.0,
        },
        {
          ownerId: 3,
          address: "426 Strait Circle",
          city: "New York City",
          state: "New York",
          country: "United States",
          lat: 40.712776,
          lng: -74.005974,
          name: "City Slick Shack",
          description:
            "Catch that northeastern breeze with this cool upgraded shack on top of our best-friend's wife's sister's apartment building!",
          price: 2465.0,
        },
        {
          ownerId: 4,
          address: "789 Holiday Drive",
          city: "Grand Rapids",
          state: "Wyoming",
          country: "United States",
          lat: 42.96336,
          lng: -85.668083,
          name: "Grand Lodging",
          description:
            "This lovely lodge is nestled right in the middle of a Class 5 rapid section. Transportation is not included.",
          price: 20.0,
        },
        {
          ownerId: 1,
          address: "123 Lane of Vacation",
          city: "Orlando",
          state: "Florida",
          country: "United States",
          lat: 24.950575,
          lng: -72.457176,
          name: "Above-water BnB Experience",
          description: "Close to Disney.",
          price: 999.0,
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
        name: {
          [Op.in]: [
            "Underwater BnB Experience",
            "Mountain Getaway",
            "City Slick Shack",
            "Grand Lodging",
            "Above-water BnB Experience",
          ],
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
