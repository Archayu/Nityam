const { green, white } = require('chalk');


module.exports = async (client, message) => {
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    message.reply({
        embeds: [embed.setDescription(`Giveaway Started`).setColor(client.color)],
      });
    
}