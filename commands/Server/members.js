const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  module.exports = {
    name: ["server", "members"],
    description: "check the total members of the server ",
    category: "Server",
    options: [],
    permissions: {
      channel: [],
      bot: [],
      user: [],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        
    await interaction.deferReply()

    

    interaction.editReply({
      embeds: [
        new EmbedBuilder({
          title: `Member Count`,
          description: `View the total number of members in the server`,
          fields: [
            {
              name: `🗿 Total Member Count`,
              value: `${interaction.guild.memberCount} members`,
              inline: false,
            },
            {
              name: `👥 Humans`,
              value: ` ${interaction.guild.members.cache.filter(member => !member.user.bot).size} memebers`,
              inline: false,
            },
            {
              name: `🤖 Bots`,
              value: `${interaction.guild.members.cache.filter(member => member.user.bot).size} bots`,
              inline: false,
            },
          ],
        }).setColor(client.color),
      ],
    });
    },
  };
  