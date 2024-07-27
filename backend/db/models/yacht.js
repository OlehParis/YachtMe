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
      price4: {
        type: DataTypes.INTEGER,
        
        validate: {
          min: 1,
        },
      },
      price6: {
        type: DataTypes.INTEGER,
        
        validate: {
          min: 1,
        },
      },
      price8: {
        type: DataTypes.INTEGER,
        
        validate: {
          min: 1,
        },
      },
    
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 300,
      },
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1940,
        max: 3000,
      },
    },
    builder: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        len: [1, 150]
      },
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 300,
      },
    },
    cabins: {
      type: DataTypes.INTEGER,
      
    },
    speed: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 500,
      },
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 20,
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
