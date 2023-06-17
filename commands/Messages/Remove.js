const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/Messages")
  module.exports = {
    name: ["messages", "remove"],
    description: "remove a certain amount of messages",
    category: "Messages",
    options: [
        {
            name: "user",
            description: "user whom you want to remove messages",
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: "amount",
            description: "amount of messages you want to remove",
            required: true,
            type: ApplicationCommandOptionType.Number
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageMessages"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply();

        const user = interaction.options.getUser("user"),
        amount = interaction.options.getNumber("amount");

        const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        data.Messages -= amount;
        await data.save();
    }
    else {
        return client.errNormal({
            error: `No message data found for ${user}`,
            type: 'editreply'
        }, interaction);
    }

    client.succNormal({
        text: `Removed **${amount}** messages from ${user}`,
        fields: [
            {
                name: "💬︙Total messages",
                value: `${data.Messages}`,
                inline: true,
            }
        ],
        type: 'editreply'
    }, interaction);
    },
  };
  