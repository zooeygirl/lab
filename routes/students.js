const { Student, validate } = require("../models/student");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const students = await User.find({ role: "Student" }).sort("name");
  res.send(students);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const student = new Student({
    username: req.body.username,
    completed: req.body.completed,
    dateCompleted: req.body.dateCompleted,
    teacher: req.body.teacher,
    validatedBy: req.body.validatedBy
  });

  await student.save(function(err) {
    console.log(err);
    if (err) res.status(400).send(err.message);
    if (!err) res.send(student);
  });
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const student = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      completed: req.body.completed,
      dateCompleted: req.body.dateCompleted,
      validatedBy: req.body.validatedBy,
      exerciseRatings: req.body.exerciseRatings
    },
    { new: true }
  );

  if (!student)
    return res.status(404).send("The student with the given ID was not found.");

  res.send(student);
});

router.put("/exercises/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const student = await User.findByIdAndUpdate(
    req.params.id,
    {
      exerciseRatings: req.body.exerciseRatings
    },
    { new: false }
  );

  if (!student)
    return res.status(404).send("The student with the given ID was not found.");

  res.send(student);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const student = await User.findByIdAndRemove(req.params.id);

  if (!student)
    return res.status(404).send("The student with the given ID was not found.");

  res.send(student);
});

router.get("/:id", async (req, res) => {
  const student = await User.findById(req.params.id);

  if (!student)
    return res.status(404).send("The student with the given ID was not found.");

  res.send(student);
});

module.exports = router;
