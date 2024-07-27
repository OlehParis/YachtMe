"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Yacht, { foreignKey: "yachtId" });
      Review.belongsTo(models.User, {foreignKey: "userId"});
      
      Review.hasMany(
        models.YachtImage,
          { foreignKey: 'yachtId', onDelete: 'CASCADE',  hooks: true }
      );
    }
  }
  Review.init(
    {
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
          isInt:true,
          min:1,
          max:5
        }
      },
      yachtId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
