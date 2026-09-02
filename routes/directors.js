const express = require("express");
const {
  addDirector,
  getDirector,
  deleteDirector,
  updateDirector,
} = require("../services/directorsService");

const router = express.Router();

router.post("/movies/:movieId/directors/", async (req, res) => {
  try {
    const result = await addDirector(req.params.movieId, req.body);

    if (result === null) {
      return res.status(404).send("movie not found");
    }
    if (result === "conflict") {
      return res.status(409).send("movie already has a director");
    }

    return res.status(201).send("director created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/movies/:movieId/directors/", async (req, res) => {
  try {
    const director = await getDirector(req.params.movieId);
    if (!director) {
      return res.status(404).send("movie not found");
    }
    return res.status(200).send(director);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.put("/movies/:movieId/directors/:directorId", async (req, res) => {
  try {
    const updatedDirector = await updateDirector(req.params.directorId, req.body, {
      new: true,
    });

    if (!updatedDirector) {
      return res.status(404).send("director not found");
    }

    return res.status(200).send(updatedDirector);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.delete("/movies/:movieId/directors/:directorId", async (req, res) => {
  try {
    const deletedDirector = await deleteDirector(
      req.params.movieId,
      req.params.directorId,
    );

    if (!deletedDirector) {
      return res.status(404).send("Director not found");
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
