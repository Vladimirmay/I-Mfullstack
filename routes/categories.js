const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoriesService");
const { handleValidationErrors, asyncHandler } = require("../utils/validationError");
const { body, param } = require("express-validator");

const router = express.Router();

const createCategoryHandler = asyncHandler(async (req, res) => {
  await createCategory(req.body);
  return res.status(201).send("category created");
});

const getCategoriesHandler = asyncHandler(async (req, res) => {
  const categories = await getCategories();
  return res.status(200).send(categories);
});

const getCategoryHandler = asyncHandler(async (req, res) => {
  const category = await getCategory(req.params.categoryId);

  if (!category) {
    return res.status(404).send("category not found");
  }
  return res.status(200).send(category);
});

const updateCategoryHandler = asyncHandler(async (req, res) => {
  const updatedCategory = await updateCategory(req.params.categoryId, req.body, {
    new: true,
  });

  if (!updatedCategory) {
    return res.status(404).send("category not found");
  }

  return res.status(200).send(updatedCategory);
});

const deleteCategoryHandler = asyncHandler(async (req, res) => {
  const deletedCategory = await deleteCategory(req.params.categoryId);

  if (!deletedCategory) {
    return res.status(404).send("category not found");
  }
  return res.status(204).send();
});

const categoryValidationRules = {
  post: [body("title").notEmpty()],
  put: [param("categoryId").isMongoId(), body("title").optional().notEmpty()],
  get: param("categoryId").isMongoId(),
  delete: param("categoryId").isMongoId(),
};

router.post(
  "/categories",
  categoryValidationRules.post,
  handleValidationErrors,
  createCategoryHandler,
);

router.get("/categories", getCategoriesHandler);

router.get(
  "/categories/:categoryId",
  categoryValidationRules.get,
  handleValidationErrors,
  getCategoryHandler,
);

router.put(
  "/categories/:categoryId",
  categoryValidationRules.put,
  handleValidationErrors,
  updateCategoryHandler,
);

router.delete(
  "/categories/:categoryId",
  categoryValidationRules.delete,
  handleValidationErrors,
  deleteCategoryHandler,
);

module.exports = router;
