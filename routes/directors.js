const express = require("express");
const {
  createDirector,
  getDirectors,
  getDirector,
  updateDirector,
  deleteDirector,
} = require("../services/directorsService");

const router = express.Router();

router.post("/directors", async (req, res) => {
  try {
    await createDirector(req.body);
    return res.status(201).send("director created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/directors", async (req, res) => {
  try {
    const directors = await getDirectors();
    return res.status(200).send(directors);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/directors/:directorId", async (req, res) => {
  try {
    const director = await getDirector(req.params.directorId);

    if (!director) {
      return res.status(404).send("director not found");
    }
    return res.status(200).send(director);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.put("/directors/:directorId", async (req, res) => {
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

router.delete("/directors/:directorId", async (req, res) => {
  try {
    const deletedDirector = await deleteDirector(req.params.directorId);

    if (!deletedDirector) {
      return res.status(404).send("director not found");
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
