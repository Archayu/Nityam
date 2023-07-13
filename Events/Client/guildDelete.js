const { WebhookClient, EmbedBuilder } = require("discord.js")
const config = require("../../Settings/config");
const moment = require("moment");

module.exports = async (client, guild) => {
    const logchannel = new WebhookClient({
       url: `${config.webhook.leave}`
    })

    let own = await guild.fetchOwner();

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `Removed From a Server!`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields([
            { name: "Name", value: `\`\`\`${guild.name}\`\`\``, inline: true },
            { name: "ID", value: `\`\`\`${guild.id}\`\`\``, inline: true },
            { name: "Member Count", value: `\`\`\`${guild.memberCount} Members\`\`\``, inline: true },
            {
                name: "Owner",
                value: `\`\`\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"} | ${
                    own.id
                }\`\`\``,
            },
            { name: "Creation Date", value: `\`\`\`${moment.utc(guild.createdAt).format("DD/MMM/YYYY")}\`\`\`` },
            { name: `${client.user.username}'s Server Count`, value: `\`\`\`${client.guilds.cache.size} Servers\`\`\`` },
        ])
        .setColor(client.color)
        .setTimestamp();
    
    logchannel.send({ embeds: [embed], username: "Leave Logger"})

   

}