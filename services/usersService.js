const { User } = require("../models");

const createUser = (body) => {
  return User.create(body);
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
