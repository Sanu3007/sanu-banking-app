const mongoose = require("mongoose");
const users = require("../utils/users");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  balance: Number,
  avatar: String,
});

const User = new mongoose.model("User", userSchema);
// User.insertMany(users).then((res) => {
//   console.log("Inserted");
// });
module.exports = User;
