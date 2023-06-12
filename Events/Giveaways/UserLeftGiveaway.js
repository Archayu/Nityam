const { green, white } = require('chalk');


module.exports = async (client, member, giveaway) => {
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    member.send({
        embeds: [embed.setDescription(`You Left ${giveaway.prize} Giveaway`).setColor(client.color)],
      });
    
}