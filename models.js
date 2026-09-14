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

const UserSchema = new Schema({
  email: String,
  username: String,
  roles: [String],
  password: { type: String, required: true, select: false },
  token: String,
});

const Category = model("Category", CategoriesSchema);
const Movie = model("Movie", MovieSchema);
const Director = model("Director", DirectorSchema);
const Comments = model("Comments", CommentsSchema);
const User = model("User", UserSchema);

module.exports = {
  MovieSchema,
  CategoriesSchema,
  DirectorSchema,
  CommentsSchema,
  UserSchema,
  Category,
  Movie,
  Director,
  Comments,
  User,
};
