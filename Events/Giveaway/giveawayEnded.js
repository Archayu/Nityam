const Discord = require("discord.js")
module.exports = async (client, giveaway, winners) => {
    winners.forEach((member) => {
        member.send({
          embeds: [new Discord.EmbedBuilder()
            .setTitle(`🎁 Let's goo!`)
            .setColor("Orange")
         .setDescription(`**Congratulations ${member.user}**\nYou Have Won **[[${giveaway.prize}]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})\n --May BE You Should Dm The Host To Claim That--**`)
            .setTimestamp()
            .setFooter({
              text: `${member.user.username}`, 
              iconURL: member.user.displayAvatarURL()
             })
          ]
        }).catch(e => {})
      });
    }