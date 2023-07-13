const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  CommandInteraction,
  Client,
  CommandInteractionOptionResolver,
} = require("discord.js");
const Schema = require("../../Models/ModLogs");
module.exports = {
  name: ["modlogs", "disable"],
  description: "disable modlogs",
  category: "Moderation",
  options: [],
  permissions: {
    channel: [],
    bot: [],
    user: ["Administrator"],
  },
  settings: {
    isPremium: false,
    isOwner: false,
    inVoice: false,
    isNSFW: false,
    sameVoice: false,
  },
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run: async (interaction, client) => {
    interaction.deferReply();

    const data =
      (await Schema.findOne({
        Guild: interaction.guildId,
      })) ||
      (await Schema.create({
        Guild: interaction.guildId,
      }));

    if (data.Enabled !== true)
      return await interaction.reply({
        content: `Modlogs system is already disabled`,
      });

    data.Channel = null;
    data.Enabled = false;
    data.save();

    await interaction.editReply({
      content: `${client.emoji.Success} Logs have been disabled`,
    });
  },
};
