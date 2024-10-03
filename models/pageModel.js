const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Page = sequelize.define("Pages", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.INTEGER, defaultValue: 1 },
  description: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Page;
