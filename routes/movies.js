const express = require("express");
const { Movie } = require("../models");

const router = express.Router();

router.post("/movies", async (req, res) => {
  try {
    await Movie.create(req.body); // добавляем документ
    return res.status(201).send("movie created"); // возвращаем ответ
  } catch (error) {
    return res.status(500).send(error.message); // возвращаем ошибку с кодом
  }
});

module.exports = router;
