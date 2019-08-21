const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const exerciseSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 200,
    required: true
  },
  shortTitle: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  },

  averageRating: {
    type: Number
  },
  url: {
    type: Array
  }
});

const Exercise = mongoose.model("Exercises", exerciseSchema);

async function createExercise() {
  const exercise = new Exercise({
    title: "Ted talk about fish",
    shortTitle: "Fish",
    averageRating: 3,
    url: "www.tedFish.com"
  });

  const result = await exercise.save();
  console.log(result);
}

createExercise();

function validateExercise(exercise) {
  const schema = {
    //_id: Joi.objectId().required,
    _id: Joi.string(),
    title: Joi.string()
      .min(1)
      .max(200)
      .required(),
    shortTitle: Joi.string()
      .min(1)
      .max(30)
      .required(),
    averageRating: Joi.number(),
    url: Joi.string().required()
  };

  console.log(Joi.validate(exercise, schema));
  return Joi.validate(exercise, schema);
}

exports.Exercise = Exercise;
exports.validate = validateExercise;
exports.exerciseSchema = exerciseSchema.plugin(uniqueValidator);
