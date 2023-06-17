const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const invites = require("../../Models/Invites")
  module.exports = {
    name: ["invites", "show"],
    description: "see invites of the user",
    category: "Invites",
    options: [
        {
            name: "user",
            description: "user whom you want to see invites",
            type: ApplicationCommandOptionType.User,
            required: false
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
    run: async (interaction, client) => {
        await interaction.deferReply();
        let user = interaction.options.getUser('user') || interaction.user;

       
    invites.findOne({ Guild: interaction.guild.id, User: user.id }, async (err, data) => {
        if (data) {
            client.embed({
                title: "➕・Invites",
                desc: `**${user.tag}** has \`${data.Invites}\` invites (Fakes And Rejoins Are Not Included)`,
                fields: [
                    {
                        name: "Total",
                        value: `${data.Total}`,
                        inline: true
                    },
                    {
                        name: "Rejoins",
                        value: `${data.Rejoin}`,
                        inline: true
                    },
                    {
                        name: "Fakes",
                        value: `${data.Fake}`,
                        inline: true
                    },
                    {
                        name: "Left",
                        value: `${data.Left}`,
                        inline: true
                    }
                ],
                type: 'editreply'
            }, interaction)
        }
        else {
            client.embed({
                title: "➕・Invites",
                desc: `**${user.tag}** has \`0\` invites`,
                fields: [
                    {
                        name: "Total",
                        value: `0`,
                        inline: true
                    },
                    {
                        name: "Rejoins",
                        value: `0`,
                        inline: true
                    },
                    {
                        name: "Fakes",
                        value: `0`,
                        inline: true
                    },
                    {
                        name: "Left",
                        value: `0`,
                        inline: true
                    }
                ],
                type: 'editreply'
            }, interaction)
        }
    });
    
    },
  };
  