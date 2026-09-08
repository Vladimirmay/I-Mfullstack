const express = require("express");
const {
  createMovie,
  deleteMovie,
  updateMovie,
  getMovies,
  getMovie,
  countMoviesByDirector,
  countMoviesByYearRange,
} = require("../services/movieService");

const { handleValidationErrors, asyncHandler } = require("../utils/validationError");
const { body, param } = require("express-validator");

const router = express.Router();

const createMovieHandler = asyncHandler(async (req, res) => {
  await createMovie(req.body);
  return res.status(201).send("movie created");
});

const getMoviesHandler = asyncHandler(async (req, res) => {
  const movies = await getMovies();
  return res.status(200).send(movies);
});

const getMovieHandler = asyncHandler(async (req, res) => {
  const movie = await getMovie(req.params.movieId);

  if (!movie) {
    return res.status(404).send("movie not found");
  }
  return res.status(200).send(movie);
});

const updateMovieHandler = asyncHandler(async (req, res) => {
  const updatedMovie = await updateMovie(req.params.movieId, req.body, {
    new: true,
  });

  if (!updatedMovie) {
    return res.status(404).send("movie not found");
  }

  return res.status(200).send(updatedMovie);
});

const deleteMovieHandler = asyncHandler(async (req, res) => {
  const deletedMovie = await deleteMovie(req.params.movieId);

  if (!deletedMovie) {
    return res.status(404).send("movie not found");
  }
  return res.status(204).send();
});

const movieValidationRules = {
  post: [body("title").notEmpty(), body("year").isNumeric(), body("director").notEmpty()],
  patch: [
    param("movieId").isMongoId(),
    body("title").optional().notEmpty(),
    body("year").optional().isNumeric(),
    body("director").optional().notEmpty(),
  ],
  get: param("movieId").isMongoId(),
  delete: param("movieId").isMongoId(),
};

router.post(
  "/movies",
  movieValidationRules.post,
  handleValidationErrors,
  createMovieHandler,
);

router.get("/movies", getMoviesHandler);

router.get(
  "/movies/:movieId",
  movieValidationRules.get,
  handleValidationErrors,
  getMovieHandler,
);

router.patch(
  "/movies/:movieId",
  movieValidationRules.patch,
  handleValidationErrors,
  updateMovieHandler,
);

router.delete(
  "/movies/:movieId",
  movieValidationRules.delete,
  handleValidationErrors,
  deleteMovieHandler,
);

const countMoviesByDirectorHandler = asyncHandler(async (req, res) => {
  const result = await countMoviesByDirector(req.params.directorId);
  return res.status(200).send(result);
});

router.get("/movies/count/by-director/:directorId", countMoviesByDirectorHandler);

const countMoviesByYearRangeHandler = asyncHandler(async (req, res) => {
  const result = await countMoviesByYearRange(req.query.from, req.query.to);
  return res.status(200).send(result);
});

router.get("/movies/count/by-year", countMoviesByYearRangeHandler);

module.exports = router;
