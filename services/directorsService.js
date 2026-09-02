const { Movie, Director } = require("../models");

const addDirector = async (movieId, body) => {
  const existingMovie = await Movie.findById(movieId);

  if (!existingMovie) {
    return null;
  }

  if (existingMovie.director) {
    return "conflict";
  }

  const director = await Director.create(body);
  const movie = await Movie.findByIdAndUpdate(movieId, { director: director._id });
  return { movie, director };
};

const getDirector = async (movieId) => {
  const movie = await Movie.findById(movieId).populate("director");
  return movie ? movie.director : null;
};
const updateDirector = (directorId, body, options) => {
  return Director.findByIdAndUpdate(directorId, body, options);
};

const deleteDirector = async (movieId, directorId) => {
  const deletedDirector = await Director.findByIdAndDelete(directorId);

  if (deletedDirector) {
    await Movie.findByIdAndUpdate(movieId, { director: director._id });
  }

  return deletedDirector;
};

module.exports = {
  addDirector,
  getDirector,
  deleteDirector,
  updateDirector,
};
