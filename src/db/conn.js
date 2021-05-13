const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/bank-api", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("database not connected");
  });
