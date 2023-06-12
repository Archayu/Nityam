const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/Messages")
  module.exports = {
    name: ["messages", "leaderboard"],
    description: "See the messages leaderboard",
    category: "Messages",
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
        await interaction.deferReply();


        const rawLeaderboard = await Schema.find({ Guild: interaction.guild.id }).sort(([['Messages', 'descending']]));

        if (!rawLeaderboard) return client.errNormal({
            error: `No data found!`,
            type: 'editreply'
        }, interaction);
    
        const lb = rawLeaderboard.map(e => `**${rawLeaderboard.findIndex(i => i.Guild === interaction.guild.id && i.User === e.User) + 1}** | <@!${e.User}> - Messages: \`${e.Messages}\``);
    
        await client.createLeaderboard(`💬・Messages - ${interaction.guild.name}`, lb, interaction);
    },
  };
  