const { Student, validate } = require("../models/student");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Student.find({ name: "Dave" });

  if (!students)
    return res.status(404).send("The student with the given ID was not found.");

  res.send(students);
});

module.exports = router;
