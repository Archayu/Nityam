const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: ["giveaway", "edit"],
  description: "Edit the current running giveaway",
  category: "Giveaway",
  options: [
    {
      name: "message-id",
      required: true,
      description: "The message id of the giveaway",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "prize",
      description: "The Prize that You want to edit",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "winners",
      description: "The winners that You want to edit",
      required: true,
      type: ApplicationCommandOptionType.Number,
    },
  ],
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
  run: async (interaction, client, user, language) => {

    await interaction.deferReply({ emphemeral: true});
    const messageId = interaction.options.getString("message-id"),
    prize = interaction.options.getString("prize"),
      winners = interaction.options.getNumber("winners");

    if (winners <= 0) {
      interaction.editReply({
        content: `Winners must be at least 1, not ${winners}`,
      });
    }
    if (winners == 0) {
      interaction.editReply({
        content: `Winners must be at least 1, not ${winners}`,
      });
    }

    const edited = client.giveaways.editGiveaway(messageId, {
        prize: prize,
        winCount: winners
    })

    if (edited){
        interaction.editReply({
            content: `Winners and Prize Is Been Edited`,
        })
    } else {
        interaction.editReply({
            content: `Invalid Giveaway Message Id`
        })
    }

  },
};
