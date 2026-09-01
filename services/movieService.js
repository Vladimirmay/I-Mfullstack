const { Movie } = require("../models");

const getMovies = () => {
  return Movie.find()
    .populate([{ path: "category" }, { path: "director" }, { path: "comments" }])
    .lean();
};

const getMovie = (movieId) => {
  return Movie.findById(movieId)
    .populate([{ path: "category" }, { path: "director" }, { path: "comments" }])
    .lean();
};

const createMovie = (body) => {
  return Movie.create(body);
};

const updateMovie = (movieId, body, options) => {
  return Movie.findByIdAndUpdate(movieId, body, options);
};

const deleteMovie = (movieId) => {
  return Movie.findByIdAndDelete(movieId);
};

module.exports = {
  createMovie,
  deleteMovie,
  updateMovie,
  getMovies,
  getMovie,
};
