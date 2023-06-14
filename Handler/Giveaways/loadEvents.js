const { readdirSync } = require("fs")
const { RESTEvents } = require("discord.js")
module.exports = (client) => {
    readdirSync("./Events/Giveaways/").forEach(file => {
        const event = require(`../../Events/Giveaways/${file}`);
        let eventName = file.split(".")[0];
        client.giveaways.on(eventName, event.bind(null, client));

    })
}