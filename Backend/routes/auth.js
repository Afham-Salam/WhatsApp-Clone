const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

/* signup*/

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Ensure you have your JWT_SECRET in the .env file
      { expiresIn: '1h' } // Optional: Set an expiration for the token
    );


    res
      .status(200)
      .json({
        message: "User registered successfully",
        token: token,
        id: user._id,
        name: user.username,
        email: user.email,
        lastSeen: user.lastSeen,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* login */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "User Login successfully",
      token: token,
      id: user._id,
      name: user.username,
      email: user.email,
      lastSeen: user.lastSeen, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;