const { Category } = require("../models");

const createCategory = (body) => {
  return Category.create(body);
};

const getCategories = (sort) => {
  const query = Category.find();

  if (sort) {
    query.sort(sort);
  }

  return query.lean().exec();
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
