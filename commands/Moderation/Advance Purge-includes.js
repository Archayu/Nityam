const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["advance", "purge-includes"],
    description: "purges messages that include a string",
    category: "Moderation",
    options: [
        {
            name: "string",
            description: "string to purge",
            type: ApplicationCommandOptionType.String,
            required: true,
        
        },
        {
            name: "amount",
            description: "amount of messages to purge",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    permissions: {
      channel: [],
      bot: ["ManageMessages"],
      user: ["ManageMessages"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const { channel } = interaction;
        const string = interaction.options.getString("string");
        const number = interaction.options.getInteger("amount");
        if (number > 100)
            return interaction.reply("You can only purge 100 messages at a time");
        client.purger.purgeMessagesIncludes(interaction, channel, number, string);
    },
  };
  