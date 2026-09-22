require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { parse: parseQuerystring } = require("querystring");
const mongoSanitize = require("express-mongo-sanitize");
const passport = require("./config/passport");
const moviesRouter = require("./routes/movies");
const categoriesRouter = require("./routes/categories");
const commentsRouter = require("./routes/comments");
const directorsRouter = require("./routes/directors");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

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
app.use(passport.initialize());

// req.query — геттер в Express 5, вычисляется заново из req.url при каждом
// обращении и не может быть переприсвоен, поэтому express-mongo-sanitize
// (пытается делать req.query = ...) падает на нём с TypeError. Санитизируем
// query прямо на этапе парсинга, а body/params/headers — обычным мидлваром.
app.set("query parser", (str) => mongoSanitize.sanitize(parseQuerystring(str)));

app.use((req, res, next) => {
  ["body", "params", "headers"].forEach((key) => {
    if (req[key]) {
      req[key] = mongoSanitize.sanitize(req[key]);
    }
  });
  next();
});
app.use(moviesRouter);
app.use(categoriesRouter);
app.use(commentsRouter);
app.use(directorsRouter);
app.use(usersRouter);
app.use(authRouter);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Что-то пошло не так",
  });
});

module.exports = app;
