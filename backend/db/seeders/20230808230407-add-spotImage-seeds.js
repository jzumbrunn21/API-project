"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "SpotImages";
const { SpotImage } = require("../models");
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://allears.net/wp-content/uploads/2021/04/wdw-2021-magic-kingdom-park-cinderella-castle-general-stock-atmosphere-3-scaled.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://cdn.onekindesign.com/wp-content/uploads/2017/01/Contemporary-Home-Design-Vertical-Arts-Architecture-01-1-Kindesign.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.architecturaldigest.com%2Fstory%2F7-new-york-apartments-with-envy-inducing-amenities&psig=AOvVaw21IxeCQ8i5dL5QDfxZvwxo&ust=1691622506225000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCMCC1YaXzoADFQAAAAAdAAAAABAE",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.architecturaldigest.com%2Fstory%2Fthe-zorkendorfers-wyoming-home&psig=AOvVaw0ktDJqVf6WyppXqaJf5fc6&ust=1691622532937000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNizm5OXzoADFQAAAAAdAAAAABAE",
          preview: true,
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
        spotId: {
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
