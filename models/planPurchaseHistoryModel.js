const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");


const PlanPurchaseHistory = sequelize.define("PlanPurchaseHistory", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    planId: { type: DataTypes.STRING, allowNull: false },
    p_name: { type: DataTypes.STRING, allowNull: false },
    t_date: { type: DataTypes.DATE, defaultValue: new Date() },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    day: { type: DataTypes.STRING, allowNull: false },
    plan_title: { type: DataTypes.STRING, allowNull: false },
    plan_description: { type: DataTypes.STRING, allowNull: false },
    expiry_date: { type: DataTypes.DATE, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    trans_id: { type: DataTypes.STRING, allowNull: false },
    p_method_id: { type: DataTypes.STRING, allowNull: false },
});

module.exports = PlanPurchaseHistory;