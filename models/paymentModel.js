const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PaymentList = sequelize.define("Payments", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  attributes: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, defaultValue: null },
  p_show: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "1" },
});

module.exports = PaymentList;
