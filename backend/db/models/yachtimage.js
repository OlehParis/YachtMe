"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class YachtImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      YachtImage.belongsTo(models.Yacht, {foreignKey: "yachtId"});
     
    
    };
    
  }
  YachtImage.init(
    {
      preview: DataTypes.BOOLEAN,
      yachtId: {type:DataTypes.INTEGER,
      allowNull:false},
    
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "YachtImage",
     
    }
  );
  return YachtImage;
};
