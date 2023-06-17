const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const UserXP = require("../../Models/User_Exp")
  const configs = require("../../Models/Leveling");
  module.exports = {
    name: ["level", "leaderboard"],
    description: "shows the top 10 users of the guild",
    category: "Leveling",
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

        const  data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });

        if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );

        await interaction.deferReply()
        const rawLeaderboard = await UserXP.find({ guild: interaction.guild.id }).sort(([['xp', 'descending']])).exec();

        if (!rawLeaderboard) return client.errNormal({
            error: `No data found!`,
            type: 'editreply'
        }, interaction);

        const lb = rawLeaderboard.map(e => `**${rawLeaderboard.findIndex(i => i.guild === interaction.guild.id && i.user === e.user) + 1}** | <@!${e.user}> - Level: \`${e.level.toLocaleString()}\` (${e.xp.toLocaleString()} xp)`);

        await client.createLeaderboard(`Text Level Leaderboard of ${interaction.guild.name}`, lb, interaction);

       
    },
  };
  