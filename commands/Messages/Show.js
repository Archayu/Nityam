const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/Messages")
  module.exports = {
    name: ["messages", "show"],
    description: "view the messages of the certain user",
    category: "Messages",
    options: [
        {
            name: "user",
            description: "select a user",
            type: ApplicationCommandOptionType.User,
            required: false
        }
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
    run: async (interaction, client) => {
       await interaction.deferReply();
        const user = interaction.options.getUser("user") || interaction.user
    Schema.findOne({ Guild: interaction.guild.id, User: user.id }, async (err, data) => {
        if (data) {
            client.embed({
                title: "💬・Messages",
                desc: `**${user.tag}** has \`${data.Messages}\` messages`,
                type: 'editreply'
            }, interaction)
        }
        else {
            client.embed({
                title: "💬・Messages",
                desc: `**${user.tag}** has \`0\` messages`,
                type: 'editreply'
            }, interaction)
        }
    });
    },
  };
  