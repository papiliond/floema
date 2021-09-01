const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const data = {
  meta: {
    data: {
      title: "Floema",
      description: "Beutiful images",
    },
  },
  preloader: {
    data: {
      title: "Floema",
    },
  },
};

app.get("/", (req, res) => {
  res.render("pages/home", data);
});

app.get("/about", (req, res) => {
  res.render("pages/about", data);
});

app.get("/detail/:id", (req, res) => {
  res.render("pages/detail", data);
});

app.get("/collections", (req, res) => {
  res.render("pages/collections", data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
