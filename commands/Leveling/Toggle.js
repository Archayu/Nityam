const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const configs = require("../../Models/Leveling");
module.exports = {
  name: ["level", "toggle"],
  description: "toggle text leveling on/off",
  category: "Leveling",
  options: [
    {
      name: "toggle",
      description: "Select On/Off",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "ON",
          value: "enable",
        },
        {
          name: "OFF",
          value: "disable",
        },
      ],
    },
  ],
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
    const toggle = interaction.options.getString("toggle"),
      data =
        (await configs.findOne({ id: interaction.guild.id })) ||
        (await configs.create({ id: interaction.guild.id }));
    if (toggle === "enable") {
      if (data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Already Enbaled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );

      client.succNormal(
        {
          text: `Text Leveling System Is Now Enabled`,
          type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
        },
        interaction
      );

      await configs.findOneAndUpdate(
        { id: interaction.guild.id },
        { xp: true }
      );
    } else {
      if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Already Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );

      client.succNormal(
        {
          text: `Text Leveling System Disabled`,
          type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
        },
        interaction
      );

      await configs.findOneAndUpdate(
        { id: interaction.guild.id },
        { xp: false }
      );
    }
  },
};
