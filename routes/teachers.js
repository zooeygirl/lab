const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const teachers = await User.find({ role: "Teacher" }).sort("name");
  res.send(teachers);
});

module.exports = router;
