const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); 

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rdate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 1 },
  ccode: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  refercode: { type: DataTypes.STRING, defaultValue: null },
  wallet: { type: DataTypes.STRING, defaultValue: 0 },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  gender: { type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'), allowNull: false },
  lats: { type: DataTypes.STRING, allowNull: false },
  longs: { type: DataTypes.STRING, allowNull: false },
  profile_bio: { type: DataTypes.STRING, defaultValue: null },
  profile_pic: { type: DataTypes.STRING, defaultValue: null },
  birth_date: { type: DataTypes.DATE, allowNull: false },
  search_preference: { type: DataTypes.STRING, allowNull: false },
  radius_search: { type: DataTypes.STRING, allowNull: false },
  relation_goal: { type: DataTypes.STRING, allowNull: false },
  interest: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  religion: { type: DataTypes.STRING, allowNull: false },
  other_pic: { type: DataTypes.STRING, allowNull: false },
  plan_id: { type: DataTypes.STRING, defaultValue: 0 },
  plan_start_date: { type: DataTypes.DATE, defaultValue: null },
  plan_end_date: { type: DataTypes.DATE, defaultValue: null },
  is_subscribe: { type: DataTypes.STRING, defaultValue: 0 },
  history_id: { type: DataTypes.STRING, defaultValue: 0 },
  height: { type: DataTypes.STRING, defaultValue: null },
  identity_picture: { type: DataTypes.STRING, defaultValue: null },
  is_verify: { type: DataTypes.STRING, defaultValue: 0 },
  direct_audio: { type: DataTypes.STRING, defaultValue: 1 },
  direct_video: { type: DataTypes.STRING, defaultValue: 1 },
  direct_chat: { type: DataTypes.STRING, defaultValue: 1 }
});
module.exports = User;