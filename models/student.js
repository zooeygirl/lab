const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 100,
    required: true
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
  role: { type: String },
  email: { type: String },
  exerciseRatings: {
    type: Object
  }
});

const Student = mongoose.model("Students", studentSchema);

async function createStudent() {
  const student = new Student({
    username: "Suzie",
    teacher: "Jane",
    completed: [0, 0, 0],
    dateCompleted: [0, 0, 0],
    validatedBy: [0, 0, 0],
    classroom: 1
  });

  const result = await student.save();
  console.log(result);
}

createStudent();

function validateStudent(student) {
  const schema = {
    //_id: Joi.objectId().required,
    _id: Joi.string(),
    username: Joi.string()
      .min(2)
      .max(50)
      .required(),
    completed: Joi.array().required(),
    dateCompleted: Joi.array().required(),
    teacher: Joi.string(),
    classroom: Joi.number(),
    validatedBy: Joi.array().required(),
    __v: Joi.number(),
    role: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    isAdmin: Joi.boolean(),
    exerciseRatings: Joi.object()
  };

  console.log(Joi.validate(student, schema));
  return Joi.validate(student, schema);
}

exports.Student = Student;
exports.validate = validateStudent;
exports.studentSchema = studentSchema.plugin(uniqueValidator);
