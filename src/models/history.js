'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      // define association here
      History.belongsTo(models.Patient,{foreignKey: 'patientId', targetKey:'id' ,as: 'patientDataS3'})
      History.belongsTo(models.Allcodes,{foreignKey: 'timeType', targetKey:'keyMap' ,as: 'timeTypeDataPatientS3'})

    }
  }
  History.init({
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    description: DataTypes.TEXT,
    files: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};