const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: ["giveaway", "end"],
  description: "End The Giveaway In a Guild",
  category: "Giveaway",
  options: [
    {
      name: "message-id",
      description: "The message id of the giveaway message",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissions: {
    channel: [],
    bot: [],
    user: ["ManageGuild", "ManageChannels"],
  },
  settings: {
    isPremium: false,
    isOwner: false,
    inVoice: false,
    isNSFW: false,
  },
  run: async (interaction, client, user, language) => {
    await interaction.deferReply({ ephemeral: true });

    let messageId = interaction.options.getString("message-id", true),
      ended = client.giveaways.endGiveaway(messageId);

    if (ended) {
      interaction.editReply({ content: `Ended The Giveaway` });
    } else {
      interaction.editReply({
        content: `That Giveaway is already ended or message id is invalid`,
      });
    }
  },
};
