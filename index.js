const winston = require("winston");
const express = require("express");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
