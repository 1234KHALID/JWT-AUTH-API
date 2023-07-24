require("dotenv").config();
require("./config/database").connect();
const express = require('express');
const User = require('./model/user');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(express.json());
// register api
app.post('/register', async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;

    // Validate user input

    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input field is required!");
    }

    // check if user already exist
    // Validate if user exist in our database

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login!");

    }
    //Encrypt user password

    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // Create token

    const token = jwt.sign(
      { userId: user.id, email },
      process.env.TOKEN_KEY,
      { expiresIn: '2h' }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
})

// login API

app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});


module.exports = app;

