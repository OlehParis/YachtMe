"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Yacht, { foreignKey: "yachtId" });
      Booking.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      startDateTime: {
        type: DataTypes.DATE,
       
      },
      endDateTime: {
        type: DataTypes.DATE,
        validate: {
          isAfterStartDate(value) {
            if (value <= this.getDataValue("startDateTime")) {
              throw new Error("endDate cannot be on or before startDate");
            }
          },
        },
      },
      totalPrice: {
        type: Sequelize.STRING
      },
      yachtId: DataTypes.INTEGER,
      duration: {
        type: DataTypes.INTEGER, // Duration in hours
        allowNull: false,
      },
      guests: {
        type: DataTypes.INTEGER, // Number of guests
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
