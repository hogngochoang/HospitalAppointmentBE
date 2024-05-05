'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // define association here
      Patient.hasMany(models.Booking, {foreignKey:'patientId', as: 'patientData'})
      Patient.belongsTo(models.Allcodes, {foreignKey: 'gender', targetKey:'keyMap', as: 'genderData'})
      Patient.hasMany(models.confirmedBooking, {foreignKey:'patientId', as: 'patientDataS2'})
      Patient.hasMany(models.History, {foreignKey:'patientId', as: 'patientDataS3'})

    }
  }
  Patient.init({
    email: DataTypes.STRING,
    fullName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthday: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};