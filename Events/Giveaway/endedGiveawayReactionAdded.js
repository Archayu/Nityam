const Discord = require("discord.js")
module.exports = async (client, giveaway, member) => {
    reaction.users.remove(member.user);
    member.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Giveaway ended already!`)
            .setColor('Orange')
            .setDescription(
              `Hey ${member.user}  It Seems 🤔 Like**[[This Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** that you reacted Is Already Ended :sob:\nBe quick next time!`
            )
            .setTimestamp(),
        ],
      })
}