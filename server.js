const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const url = "mongodb://localhost:27017/main";
mongoose.connect(url);

app.use(express.json());

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

app.post("/movies", async (req, res) => {
  try {
    await Movie.create(req.body); // добавляем документ
    return res.status(201).send("movie created"); // возвращаем ответ
  } catch (error) {
    return res.status(500).send(error.message); // возвращаем ошибку с кодом
  }
});

app.post("/categories", async (req, res) => {
  try {
    await Category.create(req.body);
    return res.status(201).send("category created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/", (req, res) => {
  res.send("Get Films!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
