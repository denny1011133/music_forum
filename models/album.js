'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Album.belongsTo(models.Category)
    }
  };
  Album.init({
    name: DataTypes.STRING,
    date: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    artist: DataTypes.STRING,
    company: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};