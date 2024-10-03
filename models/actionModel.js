const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Action = sequelize.define("Action", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  uid: { type: DataTypes.INTEGER, allowNull: false },
  profile_id: { type: DataTypes.INTEGER, allowNull: false },
  action: {
    type: DataTypes.ENUM("LIKE", "UNLIKE", "VIEW", "BLOCK"),
    allowNull: false,
  },
});

module.exports = Action;
