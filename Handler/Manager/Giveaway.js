const { GiveawaysManager } = require("discord-giveaways")
const { readdirSync } = require("fs")
module.exports = async (client) =>  {
    client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./Resources/Database/Giveaway.json",
  default: {
    botsCanWin: false,
    embedColor: "Orange",
    reaction: "🎁",
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