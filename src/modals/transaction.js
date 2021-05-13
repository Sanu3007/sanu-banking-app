const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: {
    type: String,
  },
  receiver: {
    type: String,
  },
  amount: {
    type: Number,
  },
  date: String,
  time: String,
  seconds: Number,
});

const Transaction = new mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
