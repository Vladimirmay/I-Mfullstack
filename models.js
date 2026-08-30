const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const MovieSchema = new Schema({
  title: String,
  year: Number,
  rating: Number,
  comments: [{ type: "ObjectId", ref: "Comments" }],
  category: { type: "ObjectId", ref: "Category" },
  duration: String,
  director: { type: "ObjectId", ref: "Director" },
});

const CategoriesSchema = new Schema({
  title: String,
});

const DirectorSchema = new Schema({
  name: String,
});

const CommentsSchema = new Schema({
  text: String,
  author: String,
  createdAt: Date,
});

const Category = model("Category", CategoriesSchema);
const Movie = model("Movie", MovieSchema);
const Director = model("Director", DirectorSchema);
const Comments = model("Comments", CommentsSchema);

module.exports = {
  MovieSchema,
  CategoriesSchema,
  DirectorSchema,
  CommentsSchema,
  Category,
  Movie,
  Director,
  Comments,
};
