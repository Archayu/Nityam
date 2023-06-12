const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    ChannelType,
  } = require("discord.js");
  
  module.exports = {
    name: ["giveaway", "start"],
    description: "start a new giveaway in a server",
    category: "Giveaway",
    options: [
      {
        name: "channel",
        type: ApplicationCommandOptionType.Channel,
        description: "channel in which to start the giveaway",
        required: true,
        channel_types: [ChannelType.GuildText],
      },
      {
        name: "prize",
        type: ApplicationCommandOptionType.String,
        description: "prize of the giveaway",
        required: true,
      },
      {
        name: "duration",
        type: ApplicationCommandOptionType.String,
        description: "duration of the giveaway",
        required: true,
      },
      {
        name: "winners",
        type: ApplicationCommandOptionType.Number,
        description: "number of winners to win",
        required: true,
        min_value: 1,
      }
    ],
    permissions: {
      channel: [],
      bot: ["ManageChannels", "ManageGuild"],
      user: ["ManageGuild", "ManageChannels"],
    },
    settings: {
        isPremium: false,
        isOwner: false,
        inVoice: false,
        isNSFW: false,
      },
    run: async (interaction, client) => {
      await interaction.deferReply({ephemeral: true});
      const channel = interaction.options.getChannel("channel"),
        prize = interaction.options.getString("prize"),
        duration = interaction.options.getString("duration"),
        winners = interaction.options.getNumber("winners");
     
     
   
      client.giveaways
        .start(interaction, {
          channel: channel,
          duration: duration,
          prize: prize,
          winnerCount: winners,
        })
        .catch((e) => {
          console.error("Error Occurred While Creating Giveaways: ", e);
        });
  
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `Successfully created a new giveaway in the ${channel} of ${prize}`
            ),
        ],
      });
    },
  };
  