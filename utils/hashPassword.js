const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomCode,
};
