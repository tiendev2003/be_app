const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Relation = sequelize.define('Relation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING,  defaultValue:"1" }
});

module.exports = Relation;