const { white, green } = require("chalk");

module.exports = (client) => {
  require("./Manager/Antinuke.js")(client);
  require("./Manager/InteractionCreate.js")(client);
  require("./Manager/Purger.js")(client);
  // require("./Manager/Player.js")(client);
  console.log(
    white("[") +
      green("INFO") +
      white("] ") +
      green("System ") +
      white("Manager Files") +
      green(" Loaded!")
  );
};
