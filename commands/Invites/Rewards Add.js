const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/InviteRewards")
  module.exports = {
    name: ["invites", "rewards-add"],
    description: "add invite role reward",
    category: "Invites",
    options: [
        {
            name: "invites",
            description: "The number of invites on which you want to add role",
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: "role",
            description: "role you want give on the invites",
            type: ApplicationCommandOptionType.Role,
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
await interaction.deferReply();


const invites = interaction.options.getNumber("invites"),
      role = interaction.options.getRole("role");

Schema.findOne({ Guild: interaction.guild.id, Invites: invites }, async (err, data) => {
    if (data) {
        return client.errNormal({ 
            error: "This invites amount already has a reward!",
            type: 'editreply'
        }, interaction);
    }
    else {
        new Schema({
            Guild: interaction.guild.id,
            Invites: invites,
            Role: role.id
        }).save();

        client.succNormal({ 
            text: `Invite reward created on \`${invites}\` Invites`,
            fields: [
                {
                    name: "📘︙Role",
                    value: `${role}`,
                    inline: true,
                }
            ],
            type: 'editreply'
        }, interaction);
    }
})
    },
  };
  