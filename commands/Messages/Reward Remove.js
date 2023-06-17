const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/MessageReward")
  module.exports = {
    name: ["messages", "rewards-remove"],
    description: "remove messages role reward",
    category: "Messages",
    options: [
        {
            name: "messages",
            type: ApplicationCommandOptionType.Number,
            required: true,
            description: "messages"
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageRoles", "ManageMessages"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply();

        const messages = interaction.options.getNumber("messages")
        Schema.findOne({ Guild: interaction.guild.id, Messages: messages }, async (err, data) => {
            if (data) {
                Schema.findOneAndDelete({ Guild: interaction.guild.id, Messages: messages }).then(() => {
                    client.succNormal({
                        text: `Message reward removed`,
                        fields: [
                            {
                                name: "💬︙Messages",
                                value: `${messages}`,
                                inline: true,
                            }
                        ],
                        type: 'editreply'
                    }, interaction);
                })
            }
            else {
                return client.errNormal({
                    error: "No message reward found at this message amount!",
                    type: 'editreply'
                }, interaction);
            }
    })


    },
  };
  