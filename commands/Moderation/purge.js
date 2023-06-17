const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
module.exports = {
  name: ["purge"],
  description: "purge messages/links/attachments from a channel",
  category: "Moderation",
  options: [
    {
      name: "amount",
      description: "amount of messages to purge",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "filter",
      description: "filter to purge by",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        {
          name: "messages",
          value: "messages",
        },
        {
          name: "links",
          value: "links",
        },
        {
          name: "attachments",
          value: "attachments",
        },
        {
          name: "bots",
          value: "bots",
        }

      ],
    },
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
    const number = interaction.options.getInteger("amount");
    const filter = interaction.options.getString("filter") || "messages";
    if (number > 100)
      return interaction.reply("You can only purge 100 messages at a time");
    if (filter === "messages") {
      client.purger.purgeMessages(interaction, channel, number);
    } else if (filter === "links") {
      client.purger.purgeMessagesWithLinks(interaction, channel, number);
    } else if (filter === "attachments") {
      client.purger.purgeMessagesWithAttachments(interaction, channel, number);
    } else if (filter === "bots") {
      client.purger.purgeBotMessages(interaction, channel);
    }
  },
};
