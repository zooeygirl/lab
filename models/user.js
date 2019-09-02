const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  lastname: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  role: {
    type: String
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  isAdmin: {
    type: Boolean
  },
  adminPassword: {
    type: String
  },
  teacher: {
    type: String
  },
  completed: {
    type: Array
  },
  dateCompleted: {
    type: Array
  },
  validatedBy: {
    type: Array
  },
  classroom: {
    type: Number
  },
  exerciseRatings: {
    type: Object
  }
});

userSchema.plugin(uniqueValidator);

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      isAdmin: this.isAdmin
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = {
    firstname: Joi.string()
      .min(1)
      .max(50)
      .required(),
    lastname: Joi.string()
      .min(1)
      .max(50)
      .required(),
    email: Joi.string().required(),

    role: Joi.string().required(),
    password: Joi.string().required(),
    adminPassword: Joi.string().allow(""),
    isAdmin: Joi.boolean(),
    teacher: Joi.string(),
    completed: Joi.array(),
    dateCompleted: Joi.array(),
    classroom: Joi.number(),
    validatedBy: Joi.array(),
    __v: Joi.number(),
    exerciseRatings: Joi.object()
  };

  console.log(Joi.validate(user, schema));
  return Joi.validate(user, schema);
}

async function getAverageExerciseRating() {
  try {
    var i;
    const results = await User.find({ role: "Student" });
    const studentRatings = await results.filter(
      s =>
        "exerciseRatings" in s &&
        s.exerciseRatings !== undefined &&
        s.exerciseRatings !== null
    );
    const averagesAndTotalVotes = [];
    const exercises = Object.keys(studentRatings[0].exerciseRatings);

    for (i = 0; i < exercises.length; i++) {
      const values = studentRatings.filter(
        v => v.exerciseRatings[exercises[i] !== 0]
      );
      const sum = values.reduce((a, b) => a + b);
      const count = values.length;

      averagesAndTotalVotes.push({
        shortTitle: exercises[i],
        average: sum / count,
        count: count
      });
    }
    console.log(averagesAndTotalVotes);
    return averagesAndTotalVotes;
  } catch (err) {
    throw err;
  }
}

exports.User = User;
exports.validate = validateUser;
exports.getAverageExerciseRating = getAverageExerciseRating;
