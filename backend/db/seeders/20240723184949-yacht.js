"use strict";

const { Yacht } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Yacht.bulkCreate(
      [
        {
          ownerId: "1",
          address: "300 Alton rd",
          city: "Miami",
          state: "Fl",
          country: "USA",
          lat: "25.7716",
          lng: "80.1397",
          name: "Miami Mistress",
          description: "This Yacht is a perfect getaway, enjoy complimentary mixers, water and ice. yacht equipped with floating water toys",
          price: "250",
          length: 53,
          year: 2006,
        },
        {
          ownerId: "2",
          address: "",
          city: "Monaco",
          state: "Monaco",
          country: "France",
          
          name: "WavesKing",
          description: "Stylish Yacht with 2 cautes and room for 2 crew members   ",
          price: "343",
          length: 63,
          year: 2018,
        },
      
        {
          ownerId: "1",
          address: "4441 Collins ave ",
          city: "Miami Beach",
          state: "Fl",
          country: "USA",
          name: "Ocean12",
          description: "Ocean12 is a great choice for any occasion, bring your friends together and enjoy ocean in this stylish yacht",
          price: "133",
          length: 71,
          year: 2019,
        },
     
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Yachts";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: ["1", "2"] },
    });
    ///...
  },
};
