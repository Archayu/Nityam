const { white, green } = require("chalk");

module.exports = async (client) => {
    require("./Music/loadDistube.js")(client);
    require("./Music/loadContent.js")(client);
    require("./Music/loadSetup.js")(client);
    require("./Music/loadUpdate.js")(client);
    console.log(white('[') + green('INFO') + white('] ') + green('Music ') + white('Events') + green(' Loaded!'));
};