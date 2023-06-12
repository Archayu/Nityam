const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const configs = require("../../Models/Leveling");
  module.exports = {
    name: ["level", "reward", "remove"],
    description: "remove the level role rewrard",
    category: "Leveling",
    options: [{
        name: "level",
        type: 3,
        description: "Level of which you want to remove",
        required: true
    }],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageRoles"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
      
        const  data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id }),
        level = interaction.options.getString("level");

        if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );
        if (!data.levelReward[level]) return interaction.reply("Yo, you don't have any level reward for this level.");

            interaction.reply({ content: "Level Up reward removed successfully" });

            data.levelReward[level] = "0";

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { levelReward: data.levelReward })
    },
  };
  