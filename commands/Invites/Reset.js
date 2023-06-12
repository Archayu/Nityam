const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/Invites")
  module.exports = {
    name: ["invites", "reset"],
    description: "Reset One User invites",
    category: "Invites",
    options: [
        {
            name: "user",
            description: "user whom invites you want to remove",
            required: true,
            type: ApplicationCommandOptionType.User
        },
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageGuild"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply();
        const user = interaction.options.getUser("user");

        Schema.findOne({ Guild: interaction.guild.id, User: user}, async (err, data) => {
            if(data) {
                Schema.findOneAndDelete({ Guild: interaction.guild.id, User: user.id})
                client.succNormal({
                    text: `Resetted The Invites Of ${user}`,
                    type: 'editreply'
                }, interaction);
            } else {
                return client.errNormal({
                    error: "The User Already Don't Have Any Invites Or Data",
                    type: 'editreply'
                }, interaction);
            }
        })
    },
  };
  