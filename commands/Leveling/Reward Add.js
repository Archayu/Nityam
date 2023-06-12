const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const configs = require("../../Models/Leveling");
  module.exports = {
    name: ["level", "reward", "add"],
    description: "add level up role reward to the level",
    category: "Leveling",
    options: [
        {
            name: "level",
            type: 3,
            description: "Levle when the user will get this reward",
            required: true
        }, {
            name: "role",
            type: 8,
            description: "The reward role user will get",
            required: true
        }
    ],
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
        const  data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });

        if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );
       const role = interaction.options.getRole("role"),
        level = interaction.options.getString("level")

        if (data.levelReward[level] === role.id) return interaction.reply("Yo, this level reward for this level already exist.");

        interaction.reply({ content: "Level Up reward updated successfully" });

        data.levelReward[level] = role.id;

        await configs.findOneAndUpdate({ id: interaction.guild.id }, { levelReward: data.levelReward })
    },
  };
  