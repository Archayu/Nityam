const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["unban"],
    description: "unban a user in a guild",
    category: "Moderation",
    options: [
        {
            name: "userid",
            description: "user id to unban",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
          name: "reason",
          description: "Why You Are Unbanning That User",
          type: ApplicationCommandOptionType.String,
          required: false
        }
    ],
    permissions: {
      channel: [],
      bot: ["BanMembers"],
      user: ["BanMembers"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply();
        const reason = interaction.options.getString("reason") || "Not Provided"
        const userid = interaction.options.getString("userid");
        const bannnedUsers = await interaction.guild.bans.fetch();
        const bannedUser = bannnedUsers.find(user => user.user.id === userid);
        if(!bannedUser) return interaction.editReply({ content: "User is not banned", ephemeral: true });
        interaction.guild.members.unban(userid).catch((e) => {  
            interaction.editReply({ content: "Failed to unban user", ephemeral: true });
            console.log(e);
        }   

        );

        client.modLogs({ interaction, reason, fields: [
          {
              name: "Action",
              value: "Unban",
              inline: true
          },
          {
              name: "Target",
              value: `${userid}`
          }
      ]})
    },
  };
  