const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Get Films!");
});

app.post("/", (req, res) => {
  res.send("Add new film");
});

app.put("/films/:id/", (req, res) => {
  res.send("Edit film");
});

app.delete("/films/:id/", (req, res) => {
  res.send("DELETE Film");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
