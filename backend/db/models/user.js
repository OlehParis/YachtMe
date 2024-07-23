'use strict';
const { Model, Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(
        models.Yacht,
          { foreignKey: 'ownerId', onDelete: 'CASCADE',  hooks: true }
      );
    
      User.hasMany(
        models.Booking,
          { foreignKey: 'userId', onDelete: 'CASCADE',  hooks: true }
      );
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      firstName:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      lastName:{
        type:DataTypes.STRING,
        allowNull:false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword","username", "email", "createdAt", "updatedAt"]
        }
      },
      // scopes: {
      //   withoutUsername: {
      //     attributes: { exclude: ['username'] }
      //   }
      // }
    }
  );
  return User;
};
