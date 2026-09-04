const { Director } = require("../models");

const createDirector = (body) => {
  return Director.create(body);
};

const getDirectors = () => {
  return Director.find().lean();
};

const getDirector = (directorId) => {
  return Director.findById(directorId).lean();
};

const updateDirector = (directorId, body, options) => {
  return Director.findByIdAndUpdate(directorId, body, options);
};

const deleteDirector = (directorId) => {
  return Director.findByIdAndDelete(directorId);
};

module.exports = {
  createDirector,
  getDirectors,
  getDirector,
  updateDirector,
  deleteDirector,
};
