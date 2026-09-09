require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const moviesRouter = require("./routes/movies");
const categoriesRouter = require("./routes/categories");
const commentsRouter = require("./routes/comments");
const directorsRouter = require("./routes/directors");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
const port = process.env.PORT_CONNECTION;

const url = process.env.URL_CONNECTION_DB;
mongoose.connect(url);

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());
app.use(moviesRouter);
app.use(categoriesRouter);
app.use(commentsRouter);
app.use(directorsRouter);
app.use(mongoSanitize());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Что-то пошло не так",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
