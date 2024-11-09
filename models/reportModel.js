const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Report = sequelize.define("Report", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reporter_id: { type: DataTypes.INTEGER, allowNull: false },
  uid: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING, allowNull: false },
  report_date: { type: DataTypes.DATE, allowNull: false },
});

module.exports = Report;
