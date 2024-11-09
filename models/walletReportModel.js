const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const WalletReport = sequelize.define("WalletReport", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  uid: { type: DataTypes.STRING, allowNull: false, unique: true },
  message: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  amt: { type: DataTypes.STRING, allowNull: false },
  tdate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = WalletReport;
