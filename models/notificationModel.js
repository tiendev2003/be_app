const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Notification=sequelize.define('Notifications',{
   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
   uid: { type: DataTypes.STRING, allowNull: false },
   datetime: { type: DataTypes.DATE, allowNull: false },
   title: { type: DataTypes.STRING, allowNull: false },
   description: { type: DataTypes.STRING, allowNull: false },
})

module.exports=Notification;