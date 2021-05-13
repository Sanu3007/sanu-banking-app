const express = require("express");
const Transaction = require("../modals/transaction");
const router = new express.Router();
const User = require("../modals/users");
const moment = require("moment");

router.get("/", (req, res) => {
  res.render("index");
});

// Create a user
router.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(404).send(err);
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      // res.status(200).send(users);
      res.render("userlist", {
        users,
      });
    } else {
      res.status(400).send({
        error: "Bad Request",
      });
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

// Get single user
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // res.status(200).send(user);
      res.render("userprofile", {
        user,
      });
    } else {
      res.status(400).send({
        error: "Bad Request",
      });
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

// Donate amount
router.get("/users/transfer/:id", async (req, res) => {
  try {
    const donater = await User.findById(req.params.id);
    let receivers = await User.find();
    receivers = receivers.filter((user) => user.id != req.params.id);
    if (donater && receivers) {
      // res.status(200).send(receivers);
      res.render("transfer", {
        donater,
        receivers,
      });
    } else {
      res.status(400).send({
        error: "Bad Request",
      });
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

// Transfer amount
router.put("/users/transfermoney/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.receiver;
    const credit = parseInt(req.body.credit);
    // console.log({ name, credit });
    const sender = await User.findById(id);
    const receiver = await User.findOne({ name });

    if (credit > 0 && credit <= sender.balance) {
      let sender_balance_new = sender.balance - credit;
      let receiver_balance_new = receiver.balance + credit;
      // console.log({ sender_balance_new, receiver_balance_new });
      //Update sender and receiver balance
      await User.findByIdAndUpdate(id, {
        balance: sender_balance_new,
        new: true,
      });
      await User.findOneAndUpdate(
        { name: receiver.name },
        {
          balance: receiver_balance_new,
          new: true,
        }
      );
      // res.send({ sender, receiver });

      // Add transaction details
      let newTransaction = new Transaction();
      newTransaction.sender = sender.name;
      newTransaction.receiver = receiver.name;
      newTransaction.amount = credit;
      const date = new Date().getTime();
      newTransaction.seconds = date;
      newTransaction.date = moment(date).format("MMMM Do YYYY");
      newTransaction.time = moment(date).format("h:mm a");
      await newTransaction.save();
      // alert("Transaction successfully completed");
      // res.status(200).send(newTransaction);
      res.redirect("/history");
    } else {
      // alert("Transaction failed");
      res.send({
        error: "Bad Request",
      });
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

// View Transaction History
router.get("/history", async (req, res) => {
  try {
    const transactionHist = await Transaction.find().sort({ seconds: -1 });
    if (transactionHist) {
      // res.status(200).send(transactionHist);
      res.render("transactionhistory", {
        transactionHist,
      });
    } else {
      res.status(400).send({ error: "Not found" });
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
