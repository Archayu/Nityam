const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/MessageReward")
  module.exports = {
    name: ["messages", "rewards-show"],
    description: "See The all message rewards",
    category: "Messages",
    options: [],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageGuild"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply();
        const rawLeaderboard = await Schema.find({ Guild: interaction.guild.id });

    if (rawLeaderboard.length < 1) return client.errNormal({
        error: `No rewards found!`,
        type: 'editreply'
    }, interaction);

    const lb = rawLeaderboard.map(e => `**${e.Messages} messages** - <@&${e.Role}>`);

    await client.createLeaderboard(`💬・Message rewards - ${interaction.guild.name}`, lb, interaction);
    },
  };
  