const express = require("express");
const { createCategory } = require("../services/movieService");

const router = express.Router();

router.post("/categories", async (req, res) => {
  try {
    await createCategory(req.body);
    return res.status(201).send("category created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
