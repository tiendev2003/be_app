const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Interest = sequelize.define("Interest", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "1" },
});

module.exports = Interest;
