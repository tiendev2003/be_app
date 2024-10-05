const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Language = sequelize.define("Languages", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "1"},
});

module.exports = Language;
