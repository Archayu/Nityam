const { GiveawaysManager } = require("discord-giveaways")
const { readdirSync } = require("fs")
module.exports = async (client) =>  {
    client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./Models/Json/Giveaway.json",
  default: {
    botsCanWin: false,
    embedColor: "Orange",
    reaction: "<:giveaway:1121648850864717874>",
    lastChance: {
      enabled: true,
      content: `** Join Fast It Is Your Last Chance! **`,
      threshold: 5000,
      embedColor: 'Orange'
    }
  }
})

try {

    readdirSync("./Events/Giveaway/").forEach(file => {
        const event = require(`../../Events/Giveaway/${file}`);
        let eventName = file.split(".")[0];
        client.giveawaysManager.on(eventName, event.bind(null, client))
    });

} catch {
    (e) => {
    }
}
}