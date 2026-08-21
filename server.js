const express = require("express");
const app = express();
const port = 3000;

const url = "mongodb://localhost:27017/"; // урл для сервиса с mongodb
const { MongoClient } = require("mongodb"); // конструктор клиентов mongodb
const client = new MongoClient(url); // создаем новый клиент для работы с базой
client.connect(); // подключаемся к базе
app.use(express.json()); // в express есть встроенный модуль

app.post("/movies", async (req, res) => {
  try {
    await client.db("main").collection("movies").insertOne(req.body); // добавляем документ
    return res.status(201).send("movie created"); // возвращаем ответ
  } catch (error) {
    return res.status(500).send(error.message); // возвращаем ошибку с кодом
  }
});

app.get("/", (req, res) => {
  res.send("Get Films!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
