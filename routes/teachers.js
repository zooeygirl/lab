const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/", async (req, res) => {
  const teachers = await User.find({ role: "Teacher" }).sort("lastname");
  res.send(_.pick(teachers, ["lastname"]));
});

module.exports = router;
