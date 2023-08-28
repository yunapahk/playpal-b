////////////////////////
// Setup - Import deps
////////////////////////
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

// SIGNUP ROUTE
const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const user = await User.create({ username, password: hashedPassword });
        res.json(user);
    } catch (error) {
        console.error(error); 
        res.status(400).json({ error: "Failed to create user" });
    }
};

// LOGIN ROUTE
const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      console.log(user)
      if (!user) {
        throw new Error("No user with that username found");
      }
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        throw new Error("Password does not match");
      }
      const token = jwt.sign({ username: user.username }, process.env.SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        path: "/",
        domain: "localhost",

        // change to true once deployed
        secure: false,

        // change to none once deployed
        sameSite: "lax", 

        maxAge: 3600000, // 1 hour
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// LOGOUT ROUTE
const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "You have been logged out" });
};

module.exports = {
  signup,
  login,
  logout
}