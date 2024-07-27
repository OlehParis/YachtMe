'use strict';
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Yachts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lat: {
        type: Sequelize.FLOAT,
      
      },
      lng: {
        type: Sequelize.FLOAT,
      
      },
      name: {
        type: Sequelize.STRING,
        
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price4: {
        type: Sequelize.INTEGER,
        
      },
      price6: {
        type: Sequelize.INTEGER,
        
      },
      price8: {
        type: Sequelize.INTEGER,
       
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      builder:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      guests:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
     
      cabins:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      speed:{
        type: Sequelize.INTEGER,
        allowNull: true,

      },
      bathrooms:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Yachts"
    await queryInterface.dropTable(options);
  }
};
