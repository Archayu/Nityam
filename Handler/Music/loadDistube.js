const { readdirSync } = require("fs");

module.exports = async (client) => {
    try {
        readdirSync("./Events/Distube/").forEach(file => {
            const event = require(`../../Events/Distube/${file}`);
            let eventName = file.split(".")[0];
            client.distube.on(eventName, event.bind(null, client));
          });
    } catch (e) {
        console.log(e);
    }
};