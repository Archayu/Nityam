const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/Invites")
  module.exports = {
    name: ["invites", "add"],
    description: "add invites to any user",
    category: "Invites",
    options: [
        {
            name: "user",
            description: "user whom you want to add invites",
            type: ApplicationCommandOptionType.User,
            required: true
        }, {
            name: "amount",
            description: "amount of invites you want to add",
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

        const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
        if (data) {
            data.Invites += amount;
            data.Total += amount;
            data.save();
        }
        else {
            new Schema({
                Guild: interaction.guild.id,
                User: user.id,
                Invites: amount,
                Total: amount,
                Left: 0,
                Rejoin: 0,
                Fake: 0,
                JoinedUsers: []
            }).save();
        }

        client.succNormal({
            text: `Added **${amount}** invites to ${user}`,
            fields: [
                {
                    name: "<:info:1121649249071927469>︙Total Real Invites",
                    value: `${data.Invites}`,
                    inline: true,
                }
            ],
            type: 'editreply'
        }, interaction);
    
    },
  };
  