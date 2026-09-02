const { Category } = require("../models");

const createCategory = (body) => {
  return Category.create(body);
};

const getCategories = () => {
  return Category.find().lean();
};

const getCategory = (categoryId) => {
  return Category.findById(categoryId).lean();
};

const updateCategory = (categoryId, body, options) => {
  return Category.findByIdAndUpdate(categoryId, body, options);
};

const deleteCategory = (categoryId) => {
  return Category.findByIdAndDelete(categoryId);
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
