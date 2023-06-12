const { green, white } = require('chalk');



module.exports = async (client, message, giveaway) => {
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    message.reply({
        embeds: [embed.setDescription(`\`${giveaway.prize}\` Giveaway Rerolled`).setColor(client.color)],
      });
}