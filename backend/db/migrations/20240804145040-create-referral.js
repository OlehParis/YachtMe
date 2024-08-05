"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Referrals",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        referrerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        referredUserId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        referralCode: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "not applied",
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Referrals";
    await queryInterface.dropTable(options);
  },
};
