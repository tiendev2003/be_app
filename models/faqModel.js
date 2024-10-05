const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Faq = sequelize.define("Faqs", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  question: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "1" },
});

module.exports = Faq;
