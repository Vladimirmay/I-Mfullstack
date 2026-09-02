const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoriesService");

const router = express.Router();

router.post("/categories", async (req, res) => {
  try {
    await createCategory(req.body);
    return res.status(201).send("category created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    return res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/categories/:categoryId", async (req, res) => {
  try {
    const category = await getCategory(req.params.categoryId);

    if (!category) {
      return res.status(404).send("category not found");
    }
    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.put("/categories/:categoryId", async (req, res) => {
  try {
    const updatedCategory = await updateCategory(req.params.categoryId, req.body, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).send("category not found");
    }

    return res.status(200).send(updatedCategory);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.delete("/categories/:categoryId", async (req, res) => {
  try {
    const deletedCategory = await deleteCategory(req.params.categoryId);

    if (!deletedCategory) {
      return res.status(404).send("category not found");
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
