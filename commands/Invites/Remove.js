const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const invites = require("../../Models/Invites")
  module.exports = {
    name: ["invites", "remove"],
    description: "remove invites to any user",
    category: "Invites",
    options: [
        {
            name: "user",
            description: "user whom you want to remove invites",
            type: ApplicationCommandOptionType.User,
            required: true
        }, {
            name: "amount",
            description: "amount of invites you want to remove",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
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
        let user = interaction.options.getUser('user');
        let amount = interaction.options.getNumber('amount');

        const data = await invites.findOne({ Guild: interaction.guild.id, User: user.id });
        if (data) {
            data.Invites -= amount;
            data.Total -= amount;
            data.save();
        }
        else {
            return client.errNormal({
                error: `No invite data found for ${user}`,
                type: 'editreply'
            }, interaction);
        }

        client.succNormal({
            text: `Removed **${amount}** invites to ${user}`,
            fields: [
                {
                    name: "➕︙Total Real Invites",
                    value: `${data.Invites}`,
                    inline: true,
                }
            ],
            type: 'editreply'
        }, interaction);
    
    },
  };
  