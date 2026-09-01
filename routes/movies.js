const express = require("express");
const {
  createMovie,
  deleteMovie,
  updateMovie,
  addComment,
} = require("../services/movieService");

const router = express.Router();

router.post("/movies", async (req, res) => {
  try {
    await createMovie(req.body); // добавляем документ
    return res.status(201).send("movie created"); // возвращаем ответ
  } catch (error) {
    return res.status(500).send(error.message); // возвращаем ошибку с кодом
  }
});

router.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);

    if (!deletedMovie) {
      return res.status(404).send("movie not found");
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.put("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).send("movie not found");
    }

    return res.status(200).send(updatedMovie);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post("/movies/:movieId/comments/", async (req, res) => {
  try {
    const resultComment = await addComment(req.params.movieId, req.body);

    if (!resultComment) {
      return res.status(404).send("movie not found");
    }

    return res.status(201).send("comment created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
