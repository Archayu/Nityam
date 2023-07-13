const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");
const Schema = require("../../Models/ModLogs");
module.exports = {
  name: ["modlogs", "enable"],
  description: "enable modlogs",
  category: "Moderation",
  options: [
    {
      name: "channel",
      description: "channel to add modlogs in",
      type: ApplicationCommandOptionType.Channel,
      required: true,
      channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    },
  ],
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
    const channel = interaction.options.getChannel("channel");

    if (data.Channel === channel.id)
      return await interaction.editReply({
        content: `${client.emoji.Error} This is already the modlogs channel`,
      });

    data.Channel = channel.id;
    data.Enabled = true;
    data.save();

    await interaction.editReply({
      content: `${client.emoji.Success} Logs have been set to ${channel}`,
    });
  },
};
