const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Faq= sequelize.define('Faqs', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question : { type: DataTypes.STRING, allowNull: false },
    answer : { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
});

module.exports = Faq;