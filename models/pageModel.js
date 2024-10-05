const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Page = sequelize.define("Pages", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "1" },
});

module.exports = Page;
