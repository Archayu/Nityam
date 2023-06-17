const { WebhookClient, EmbedBuilder } = require("discord.js")
const config = require("../../Settings/config")
module.exports = async (client, guild) => {
    /*
    if (members < 40) {
        let owner = await guild.fetchOwner();
        owner.send({ content: "fake guild found leaving it" })
        setTimeout(() => {
            guild.leave()
        })
    } else {
    

    const logchannel = new WebhookClient({
        url: `${config.webhook.join}`
    })
    let guilds = client.guilds.cache.size;

    let owner = await guild.fetchOwner();
    const embed = new EmbedBuilder()
    .setAuthor({ iconURL: guild.iconURL(), name: guild.name})
    .setTitle("💚 Addded To New Guild")
    .setDescription(`Guild Name: ${guild.name} (${guild.id})\nGuild Owner: <@!${owner.id}> (${owner.id})\n Guild Members: ${guild.memberCount}\nTotal Guilds: ${guilds}`)
    .setColor(client.color)
    
    logchannel.send({ embeds: [embed], username: "Join Logger"})
    }
*/
}