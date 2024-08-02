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
        models.Review,
          { foreignKey: 'userId', onDelete: 'CASCADE',  hooks: true }
      );
    
      User.hasMany(
        models.Booking,
          { foreignKey: 'userId', onDelete: 'CASCADE',  hooks: true }
      );
    }
  };

  User.init(
    {
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
      credit:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      phoneNumber:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      referralCode:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      ReferralId:{
        type: DataTypes.INTEGER,
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
