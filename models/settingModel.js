const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Setting = sequelize.define("Setting", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  webname: { type: DataTypes.STRING, allowNull: false },
  weblogo: { type: DataTypes.STRING, allowNull: false },
  timezone: { type: DataTypes.STRING, allowNull: false },
  currency: { type: DataTypes.STRING, allowNull: false },
  one_key: { type: DataTypes.STRING, allowNull: false },
  one_hash: { type: DataTypes.STRING, allowNull: false },
  show_dark: { type: DataTypes.INTEGER, defaultValue: 0 },
  scredit: { type: DataTypes.INTEGER, defaultValue: 0 },
  rcredit: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Setting;