"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Mike",
          lastName: "Doe",
          email: "demo@user.io",
          phoneNumber: 7863043243,
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Nick",
          lastName: "Robson",
          email: "user1@user.io",
          phoneNumber: 7863043143,
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Lina",
          lastName: "Pudge",
          email: "user2@user.io",
          phoneNumber: 7863043043,
          hashedPassword: bcrypt.hashSync("password3"),
        },
      ],
     { validate: true } 
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, 
      {
      email: { [Op.in]: ["demo@user.io", "user1@user.io", "user2@user.io"] },
    });
    ///...
  },
};
