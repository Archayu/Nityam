const { white, green } = require("chalk");

module.exports = (client) => {
    require("./Functions/Embeds")(client);
    require("./Functions/Functions")(client);
    console.log(white('[') + green('INFO') + white('] ') + green('System ') + white('Function Files') + green(' Loaded!'));
};