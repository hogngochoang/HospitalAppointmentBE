'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcodes extends Model {
    static associate(models) {
      // define association here
      Allcodes.hasMany(models.User,{foreignKey: 'positionId', as: 'positionData'})
      Allcodes.hasMany(models.User,{foreignKey: 'gender', as: 'genderData'})
      Allcodes.hasMany(models.Schedule,{foreignKey: 'timeType', as: 'timeTypeData'})
      Allcodes.hasMany(models.Booking,{foreignKey: 'timeType', as: 'timeTypeDatapatient'})
      Allcodes.hasMany(models.Patient,{foreignKey: 'gender', as: 'genderDataPatient'})
      Allcodes.hasMany(models.confirmedBooking,{foreignKey: 'timeType', as: 'timeTypeDatapatientS2'})
      Allcodes.hasMany(models.History,{foreignKey: 'timeType', as: 'timeTypeDatapatientS3'})

    }
  }
  Allcodes.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueVI: DataTypes.STRING,
    valueEN: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Allcodes',
  });
  return Allcodes;
};