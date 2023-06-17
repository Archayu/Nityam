const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const invites = require("../../Models/Invites")
  module.exports = {
    name: ["invites", "leaderboard"],
    description: "Show The LeaderBoard Of the Guild",
    category: "Invites",
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
        

        const rawLeaderboard = await invites.find({ Guild: interaction.guild.id }).sort(([['Invites', 'descending']]));

        if (!rawLeaderboard) return client.errNormal({
            error: `No data found!`,
            type: 'editreply'
        }, interaction);
    
        const lb = rawLeaderboard.map(e => `**${rawLeaderboard.findIndex(i => i.Guild === interaction.guild.id && i.User === e.User) + 1}** | <@!${e.User}> - Invites: \`${e.Invites}\``);
    
        await client.createLeaderboard(`➕・Invites - ${interaction.guild.name}`, lb, interaction);
    },
  };
  