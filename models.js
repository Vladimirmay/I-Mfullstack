const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  rating: Number,
  category: String,
  duration: String,
  director: String,
});

const CategoriesSchema = new mongoose.Schema({
  title: String,
});

const Category = mongoose.model("Category", CategoriesSchema);
const Movie = mongoose.model("Movie", MovieSchema); // создаем модель по схеме

module.exports = { MovieSchema, CategoriesSchema, Category, Movie };
