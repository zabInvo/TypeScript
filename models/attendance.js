"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Employees);
    }
  }
  Attendance.init(
    {
      date: {
        type: DataTypes.STRING,
        validate: {
          isDate: true,
        },
      },
      status: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
