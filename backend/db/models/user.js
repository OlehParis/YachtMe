'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(
        models.Yacht,
        { foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true }
      );
      User.hasMany(
        models.Review,
        { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true }
      );
      User.hasMany(
        models.Booking,
        { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true }
      );

      // Association for referrals
      User.hasMany(
        models.Referral,
        { foreignKey: 'referrerId', as: 'Referrals', onDelete: 'CASCADE', hooks: true }
      );
    }

    // Method to generate a unique referral code
    static generateReferralCode() {
      return uuidv4().slice(0, 8); // Generate a short UUID
    }

    // Method to handle referral logic
    static async handleReferral(referralCode) {
      const referrer = await User.findOne({ where: { referralCode } });
      if (referrer) {
        await referrer.increment('credit', { by: 250 });
        return referrer.id; // Return referrer ID if found
      }
      return null; // No referral found
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      credit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Default credits to 0
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true, // Ensure referral codes are unique
      },
      ReferralId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Reference to Users table
          key: 'id',
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "username", "email", "createdAt", "updatedAt"],
        },
      },
      // scopes: {
      //   withoutUsername: {
      //     attributes: { exclude: ['username'] }
      //   }
      // }
    }
  );

  // Before creating a new user, generate a unique referral code
  User.beforeCreate(async (user) => {
    user.referralCode = User.generateReferralCode();
  });

  return User;
};
