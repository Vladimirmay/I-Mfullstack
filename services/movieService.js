const { Movie } = require("../models");
const mongoose = require("mongoose");

const getMovies = ({ filters, sort }) => {
  const query = Movie.find();

  if (filters.title) {
    query.where("title", filters.title);
  }
  if (filters.category) {
    query.where("category", filters.category);
  }
  if (sort) {
    query.sort(sort);
  }

  return query
    .populate([{ path: "category" }, { path: "director" }, { path: "comments" }])
    .lean()
    .exec();
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

const countMoviesByDirector = (directorId) => {
  return Movie.aggregate([
    {
      $match: {
        director: new mongoose.Types.ObjectId(directorId),
      },
    },
    { $count: "total" },
  ]);
};

const countMoviesByYearRange = (from, to) => {
  return Movie.aggregate([
    {
      $match: {
        year: {
          $gte: Number(from),
          $lte: Number(to),
        },
      },
    },
    { $count: "total" },
  ]);
};

module.exports = {
  createMovie,
  deleteMovie,
  updateMovie,
  getMovies,
  getMovie,

  countMoviesByDirector,
  countMoviesByYearRange,
};
