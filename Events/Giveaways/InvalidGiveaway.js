const { green, white } = require('chalk');


module.exports = async (client, member, giveaway) => {
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    member.send({
        embeds: [embed.setDescription(`You are Joining in Ended Giveaway, Because That Giveaway is Not In My Database`).setColor(client.color)],
      });
}