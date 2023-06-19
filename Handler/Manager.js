const { white, green } = require("chalk");

module.exports = (client) => {
  require("./Manager/Antinuke.js")(client);
  require("./Manager/InteractionCreate.js")(client);
  require("./Manager/Purger.js")(client);
  require("./Manager/Giveaway.js")(client);
  
  console.log(
    white("[") +
      green("INFO") +
      white("] ") +
      green("System ") +
      white("Antinuke") +
      green(" Loaded!")
  );

  console.log(
    white("[") +
      green("INFO") +
      white("] ") +
      green("System ") +
      white("Buttons") +
      green(" Loaded!")
  );

  console.log(
    white("[") +
      green("INFO") +
      white("] ") +
      green("System ") +
      white("Purger") +
      green(" Loaded!")
  );

  console.log(
    white("[") +
      green("INFO") +
      white("] ") +
      green("System ") +
      white("Giveaway") +
      green(" Loaded!")
  );

};
