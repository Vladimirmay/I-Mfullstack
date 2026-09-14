const bcrypt = require("bcrypt");
const { User } = require("../models");
const { generateToken } = require("./authService");

const SALT_ROUNDS = 10;

const createUser = async (body) => {
  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
  const jwtToken = generateToken(body.email);
  return User.create({ ...body, password: passwordHash, token: jwtToken });
};

const getUsers = () => {
  return User.find().lean();
};

const getUser = (userId) => {
  return User.findById(userId).lean();
};

const updateUser = (userId, body, options) => {
  return User.findByIdAndUpdate(userId, body, options);
};

const deleteUser = (userId) => {
  return User.findByIdAndDelete(userId);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
