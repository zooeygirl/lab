const { User, validate, getAverageExerciseRating } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const auth = "../middleware/auth";

const router = express.Router();

router.get("/me", async (req, res) => {
  const user = await User.findById(req.user._id.select("-password"));
  res.send(user);
});

router.get("/averages", async (req, res) => {
  console.log(getAverageExerciseRating());
  res.send(await getAverageExerciseRating());
});

router.post("/", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
    isAdmin: await checkAdminPassword(req),
    teacher: req.body.teacher,
    completed: [],
    dateCompleted: [],
    validatedBy: []
  });

  async function checkAdminPassword(req) {
    if (req.body.role === "Teacher" || req.body.role === "Tutor") {
      if (req.body.adminPassword !== "coconut") {
        return res.status(400).send("Not the administrator password.");
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    const result = await user.save();
    console.log(result);
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "firstname", "lastname", "email"]));
  } catch (ex) {
    res.send(ex.errors);
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
});

router.put("/:id", async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: req.body.role,
      email: req.body.email,
      password: req.body.password,
      completed: req.body.completed,
      dateCompleted: req.body.dateCompleted,
      validatedBy: req.body.validatedBy,
      exerciseRatings: req.body.exerciseRatings
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
});

module.exports = router;
