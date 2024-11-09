const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Religion = sequelize.define("Religion", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "1" },
});

module.exports = Religion;
