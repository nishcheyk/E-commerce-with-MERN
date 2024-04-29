const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../Models/user");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, isAdmin } = req.body.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      username,
      email,
      password,
      isAdmin,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    const token = newUser.generateAuthToken();

    const data = {
      token,
      userId: newUser.id,
      isAdmin: newUser.isAdmin,
    };
    res.status(201).json(data);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = user.generateAuthToken();
    const data = {
      token,
      userId: user.id,
      isAdmin: user.isAdmin,
    };
    res.json(data);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
