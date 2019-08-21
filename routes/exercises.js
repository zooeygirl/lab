const { Exercise, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const auth = "../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
  const exercise = await Exercise.findById(req.exercise._id);
  res.send(exercise);
});

router.post("/", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let exercise = await Exercise.findOne({ email: req.body.email });
  if (exercise) return res.status(400).send("Exercise already registered.");

  exercise = new Exercise({
    title: req.body.title,
    shortTitle: req.body.shortTitle,
    averageRating: req.body.email,
    url: req.body.url,
    isAdmin: await checkAdminPassword(req)
  });

  try {
    const result = await exercise.save();
    console.log(result);
    const token = exercise.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(exercise, ["_id", "username", "email"]));
  } catch (ex) {
    res.send(ex.errors);
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
});

router.put("/:id", async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  const exercise = await Exercise.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      role: req.body.role,
      email: req.body.email,
      password: req.body.password,
      completed: req.body.completed,
      dateCompleted: req.body.dateCompleted,
      validatedBy: req.body.validatedBy
    },
    { new: true }
  );

  if (!exercise)
    return res
      .status(404)
      .send("The exercise with the given ID was not found.");

  res.send(exercise);
});

router.delete("/:id", async (req, res) => {
  const exercise = await Exercise.findByIdAndRemove(req.params.id);

  if (!exercise)
    return res
      .status(404)
      .send("The exercise with the given ID was not found.");

  res.send(exercise);
});

router.get("/:id", async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise)
    return res
      .status(404)
      .send("The exercise with the given ID was not found.");

  res.send(exercise);
});

module.exports = router;
