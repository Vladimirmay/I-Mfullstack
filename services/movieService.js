const { Movie, Comments } = require("../models");

const createMovie = (body) => {
  return Movie.create(body);
};

const deleteMovie = (movieId) => {
  return Movie.findByIdAndDelete(movieId);
};

const updateMovie = (movieId, body, options) => {
  return Movie.findByIdAndUpdate(movieId, body, options);
};

const addComment = async (movieId, body) => {
  const existingMovie = await Movie.findById(movieId);

  if (existingMovie) {
    const comment = await Comments.create(body);
    const movie = await Movie.findByIdAndUpdate(movieId, {
      $push: { comments: comment._id },
    });
    return {
      movie,
      comment,
    };
  } else return null;
};

module.exports = {
  createMovie,
  deleteMovie,
  updateMovie,
  addComment,
};
