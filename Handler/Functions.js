const { white, green } = require("chalk");

module.exports = (client) => {
    require("./Functions/Embeds")(client);
    require("./Functions/Functions")(client);
    require("./Functions/Economy")(client);
   // require("./Functions/Music")(client);
    require("./Functions/ModLog")(client)
    console.log(white('[') + green('INFO') + white('] ') + green('System ') + white('Function Files') + green(' Loaded!'));
};