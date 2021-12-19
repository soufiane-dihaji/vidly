const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/validation")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`Listening on PORT ${port}...`);
});

module.exports = server;