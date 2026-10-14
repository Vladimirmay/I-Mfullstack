require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const url = process.env.URL_CONNECTION_DB;
mongoose.connect(url);

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Что-то пошло не так",
  });
});

module.exports = app;
