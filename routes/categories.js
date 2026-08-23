const express = require("express");
const { Category } = require("../models");

const router = express.Router();

router.post("/categories", async (req, res) => {
  try {
    await Category.create(req.body);
    return res.status(201).send("category created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
