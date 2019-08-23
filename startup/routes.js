const express = require("express");
const students = require("../routes/students");
const users = require("../routes/users");
const zooey = require("../routes/zooey");
const auth = require("../routes/auth");
const teachers = require("../routes/teachers");
const exercises = require("../routes/exercises");

module.exports = function(app) {
  app.use(express.json());
  app.use(cors());

  app.use("/api/students", students);
  app.use("/api/users", users);
  app.use("/api/teachers", teachers);
  app.use("/api/exercises", exercises);

  app.use("/find_Zooey", zooey);
  app.use("/api/auth", auth);

  // app.get("/", (req, res) => {
  //   res.send("Hello World!");
  // });
};
