const { white, green } = require("chalk");

module.exports = async (client) => {
    require("./Giveaways/Main.js")(client);
    require("./Giveaways/loadEvents.js")(client);
    console.log(white('[') + green('INFO') + white('] ') + green('Giveaway ') + white('Events') + green(' Loaded!'));
};