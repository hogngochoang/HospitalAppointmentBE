'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Allcodes, {foreignKey: 'timeType', targetKey:'keyMap', as: 'timeTypeData'})
      Schedule.belongsTo(models.User,{foreignKey: 'doctorId', targetKey:'id' ,as: 'doctorData'})

    }
  }
  Schedule.init({
    doctorId: DataTypes.INTEGER,
    currNum: DataTypes.INTEGER,
    maxNum: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
  }, { 
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};