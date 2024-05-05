'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcodes, {foreignKey: 'positionId', targetKey:'keyMap', as: 'positionData'})
      User.belongsTo(models.Allcodes, {foreignKey: 'gender', targetKey:'keyMap', as: 'genderData'})
      User.hasMany(models.Schedule, {foreignKey:'doctorId', as: 'doctorData'})
      User.hasMany(models.Booking, {foreignKey:'doctorId', as: 'doctorDataPatient'})
      User.hasMany(models.confirmedBooking, {foreignKey:'doctorId', as: 'doctorDataPatientS2'})
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId:DataTypes.STRING,
    positionId:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};