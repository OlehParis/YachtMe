'use strict';

const { YachtImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await YachtImage.bulkCreate([
      // Existing Yachts
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 1,
        preview: true,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/3.jpeg",
        yachtId: 1,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 1,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 1,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 1,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/3.jpeg",
        yachtId: 2,
        preview: true,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 2,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 2,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 2,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 2,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 2,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 2,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 2,
        preview: false,
      },
    
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/4.jpeg",
        yachtId: 3,
        preview: true,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/5.jpeg",
        yachtId: 4,
        preview: true,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/6.jpeg",
        yachtId: 5,
        preview: true,
      },
    
      
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/7.jpeg",
        yachtId: 6,
        preview: true,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/8.jpeg",
        yachtId: 7,
        preview: true,
      },
      
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/9.jpeg",
        yachtId: 8,
        preview: true,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/1.jpeg",
        yachtId: 8,
        preview: false,
      },
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/11.jpeg",
        yachtId: 9,
        preview: true,
      },
     
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/10.jpeg",
        yachtId: 10,
        preview: true,
      },
     
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/12.jpeg",
        yachtId: 11,
        preview: true,
      },
    
      {
        url: "https://crosstalkappbuck.s3.us-east-2.amazonaws.com/yachtImg/13.jpeg",
        yachtId: 12,
        preview: true,
      },
     
    
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "YachtImages";

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      yachtId: { [Op.in]: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"] }
    });
  }
};
