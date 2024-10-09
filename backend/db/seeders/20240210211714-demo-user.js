"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const referral = require("../models/referral");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Seeding users...');
    await User.bulkCreate(
      [
        {
          firstName: "Mike",
          lastName: "Doe",
          email: "demo@user.io",
          phoneNumber: "7863043243",
          hashedPassword: bcrypt.hashSync("password"),
          referralCode: 'sa2daf',
          image:"https://crosstalkappbuck.s3.us-east-2.amazonaws.com/jeff.jpeg"
        },
        {
          firstName: "Nick",
          lastName: "Robson",
          email: "user1@user.io",
          phoneNumber: "7863043143",
          hashedPassword: bcrypt.hashSync("password2"),
           image:"https://crosstalkappbuck.s3.us-east-2.amazonaws.com/jeff.jpeg"
        },
        {
          firstName: "Lina",
          lastName: "Pudge",
          email: "user2@user.io",
          phoneNumber: "7863043043",
          hashedPassword: bcrypt.hashSync("password3"),
          image:"https://crosstalkappbuck.s3.us-east-2.amazonaws.com/elon.jpg"
        },
        {
          firstName: "Henry",
          lastName: "London",
          email: "user2sdd@user.io",
          phoneNumber: "7863043043", 
          hashedPassword: bcrypt.hashSync("password3"),
           image:"https://crosstalkappbuck.s3.us-east-2.amazonaws.com/jeff.jpeg"
        },
        {
          firstName: "Nick",
          lastName: "Milas",
          email: "fake2asdddd22@user.io",
          phoneNumber: "7863043243", 
          hashedPassword: bcrypt.hashSync("vbnhj123"),
             image:"https://crosstalkappbuck.s3.us-east-2.amazonaws.com/elon.jpg"
        },
        {
          firstName: "Michel",
          lastName: "Hopkins",
          email: "fake11@user.io",
          phoneNumber: "7863243043",
          hashedPassword: bcrypt.hashSync("vbnhj123"),
           image:"https://crosstalkappbuck.s3.us-east-2.amazonaws.com/jeff.jpeg"
        },
        {
          firstName: "Anna",
          lastName: "Posh",
          email: "fake2asdadd32@user.io",
          phoneNumber: "7863043643", 
          hashedPassword: bcrypt.hashSync("vbnhj123"),
             image:"https://crosstalkappbuck.s3.us-east-2.amazonaws.com/elon.jpg"
        },
        {
          firstName: "Nina",
          lastName: "Blitz",
          email: "fakeasda@user.io",
          phoneNumber: "7863143043", 
          hashedPassword: bcrypt.hashSync("vbnhj123"),
          image:"https://crosstalkappbuck.s3.us-east-2.amazonaws.com/jeff.jpeg"
        },
      ],
      { validate: true } // Validate before inserting
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        email: {
          [Op.in]: [
            "fakeasda@user.io",
            "demo@user.io",
            "user1@user.io",
            "user2@user.io",
            "fake2asdadd32@user.io",
            "fake11@user.io",
            "fake2asdddd22@user.io",
            "user2sdd@user.io",
          ],
        },
      },
      {}
    );
  },
};
