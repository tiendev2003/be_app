const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Plan = sequelize.define("Plan", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  amt: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  filter_include: { type: DataTypes.STRING, defaultValue: "0" },
  day_limit: { type: DataTypes.STRING, allowNull: false },
  direct_chat: { type: DataTypes.STRING, defaultValue: "0" },
  like_menu: { type: DataTypes.STRING, defaultValue: "0" },
  audio_video: { type: DataTypes.STRING, defaultValue: "0" },
  status: { type: DataTypes.STRING, defaultValue: "1" },
  chat: { type: DataTypes.STRING, defaultValue: "0" },
});

module.exports = Plan;
