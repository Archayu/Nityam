const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/Messages")
  module.exports = {
    name: ["messages", "add"],
    description: "add messages to any user",
    category: "Messages",
    options: [
        {
            name: "user",
            description: "user to whom you want add messages",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "messages",
            description: "amount of messages you want to add",
            type: ApplicationCommandOptionType.Number,
            required: true
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
        amount = interaction.options.getNumber("messages");

        const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        data.Messages += amount;
        await data.save();
    }
    else {
        await new Schema({
            Guild: interaction.guild.id,
            User: user.id,
            Messages: amount,
        }).save();
    }

    client.succNormal({
        text: `Added **${amount}** messages to ${user}`,
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
  