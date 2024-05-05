'use strict';
const {
  Model 
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Patient,{foreignKey: 'patientId', targetKey:'id' ,as: 'patientData'})
      Booking.belongsTo(models.Allcodes,{foreignKey: 'timeType', targetKey:'keyMap' ,as: 'timeTypeDataPatient'})
      Booking.belongsTo(models.User,{foreignKey: 'doctorId', targetKey:'id' ,as: 'doctorDataPatient'})
    }
  }
  Booking.init({
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};