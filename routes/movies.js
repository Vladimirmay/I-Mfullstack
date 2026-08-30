const express = require("express");
const { Movie, Comments } = require("../models");

const router = express.Router();

router.post("/movies", async (req, res) => {
  try {
    await Movie.create(req.body); // добавляем документ
    return res.status(201).send("movie created"); // возвращаем ответ
  } catch (error) {
    return res.status(500).send(error.message); // возвращаем ошибку с кодом
  }
});

router.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId);

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
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.movieId, req.body, {
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
    const comment = await Comments.create(req.body);

    await Movie.findByIdAndUpdate(
      req.params.movieId,
      { $push: { comments: comment._id } },
      { new: true },
    );

    return res.status(201).send("comment created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
