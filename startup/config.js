const config = require("config");
const dotenv = require("dotenv");

// const result = dotenv.config();
// console.log(result);
// console.log(result.parsed.labpassword);

console.log(config.get("jwtPrivateKey"));

module.exports = function() {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
