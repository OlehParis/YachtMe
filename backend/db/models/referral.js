'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Referral extends Model {
    static associate(models) {
      Referral.belongsTo(models.User, { foreignKey: "referrerId", as: "Referrer" });
      Referral.belongsTo(models.User, { foreignKey: "referredUserId", as: "ReferredUser" });
    }
  }
  Referral.init(
    {
      referrerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      referredUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "not applied",
      },
    },
    {
      sequelize,
      modelName: "Referral",
    }
  );

  return Referral;
};
