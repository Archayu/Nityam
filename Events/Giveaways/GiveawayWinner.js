const { green, white } = require('chalk');


module.exports = async (client, message, giveaway) => {
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    let Gwinners = giveaway.winners
    .map((winner) => `<@${winner.userID}>`)
    .join(", ");
  message.channel?.send({
    content: Gwinners,
    embeds: [
      embed.setDescription(
        `${Gwinners} Won The \`${giveaway.prize}\` Giveaway Prize. Hosted By <@${giveaway.hostedBy}>`
      ).setColor(client.color),
    ],
  });

  giveaway.winners.map(async (user) => {
    const u = await message.guild.members.fetch(user.userID);
    u.send({
      embeds: [
        embed.setDescription(
          `You Won The Giveaway [\`Giveaway Link\`](${message.url})`
        ).setColor(client.color),
      ],
    });
  });  
}