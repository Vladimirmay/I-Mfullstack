const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const moviesRouter = require("./routes/movies");
const categoriesRouter = require("./routes/categories");

const app = express();
const port = 3000;

const url = "mongodb://localhost:27017/main";
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
