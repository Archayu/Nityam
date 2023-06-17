const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/InviteRewards")
  module.exports = {
    name: ["invites", "rewards-remove"],
    description: "remove the invite reward",
    category: "Invites",
    options: [
        {
            name: "invites",
            description: "The number of invites on which you want to remove the rolereward",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageGuild", "ManageRole"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const invites = interaction.options.getNumber("invites");

        interaction.deferReply();

        Schema.findOne({ Guild: interaction.guild.id, Invites: invites }, async (err, data) => {
            if (data) {
                Schema.findOneAndDelete({ Guild: interaction.guild.id, Invites: invites }).then(() => {
                    client.succNormal({
                        text: `Invite reward removed`,
                        fields: [
                            {
                                name: "Invites",
                                value: `${invites}`,
                                inline: true,
                            }
                        ],
                        type: 'editreply'
                   
                   
                    }, interaction);
                })
            }
            else {
                return client.errNormal({
                    error: "No Invites reward found at this Invite amount!",
                    type: 'editreply'
                }, interaction);
            }
        })
    },
  };
  