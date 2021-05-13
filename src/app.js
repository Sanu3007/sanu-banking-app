const express = require("express");
const hbs = require("hbs");
const path = require("path");
const UserRouter = require("./routers/users");
const methodOverride = require("method-override");
const moment = require("moment");
require("./db/conn");

const app = express();
app.use(express.json());

const viewPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
const publicPath = path.join(__dirname, "../public");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.use(UserRouter);

app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialPath);

app.use(express.static(publicPath));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});
