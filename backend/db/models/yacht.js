"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Yacht extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Yacht.belongsTo(models.User, { foreignKey: "ownerId" });
   
      Yacht.hasMany(models.YachtImage, {
        foreignKey: "yachtId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Yacht.hasMany(
        models.Booking,
     
        { foreignKey: 'yachtId', onDelete: 'CASCADE',  hooks: true }
      );
    }
  }
  Yacht.init(
    {
      ownerId: { type: DataTypes.INTEGER, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING, allowNull: false },
      country: { type: DataTypes.STRING, allowNull: false },
      lat: {
        type: DataTypes.FLOAT,
        validate: {
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        validate: {
          min: -180,
          max: 180,
        },
      },
      name: {
        type: DataTypes.STRING(50),
        validate: {
          len: [1, 50],
        },
      },
      description: { type: DataTypes.STRING, allowNull: false },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      modelName: "Yacht",
    }
  );
  return Yacht;
};
