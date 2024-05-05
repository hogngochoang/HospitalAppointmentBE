'use strict';
const {
  Model 
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class confirmedBooking extends Model {
    static associate(models) {
      // define association here
      confirmedBooking.belongsTo(models.Patient,{foreignKey: 'patientId', targetKey:'id' ,as: 'patientDataS2'})
      confirmedBooking.belongsTo(models.Allcodes,{foreignKey: 'timeType', targetKey:'keyMap' ,as: 'timeTypeDataPatientS2'})
      confirmedBooking.belongsTo(models.User,{foreignKey: 'doctorId', targetKey:'id' ,as: 'doctorDataPatientS2'})

    }
  }
  confirmedBooking.init({
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'confirmedBooking',
  });
  return confirmedBooking;
};