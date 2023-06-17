const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["forceban"],
    description: "ban a user who is not in the guild",
    category: "Moderation",
    options: [
        {
            name: "user",
            description: "user id to ban",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "reason",
            description: "reason for ban",
            type: ApplicationCommandOptionType.String,
            required: false,
        },

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
        const userid = interaction.options.getString("user");
        const reason = interaction.options.getString("reason") || "No reason provided";
        const bans = await interaction.guild.bans.fetch();
        if (bans.get(user.id)) return interaction.reply({ content: "User is already banned", ephemeral: true });
        if(userid === interaction.user.id) return interaction.reply({ content: "You can't ban yourself", ephemeral: true }      );
        if(userid === client.user.id) return interaction.reply({ content: "You can't ban me", ephemeral: true }                                 );
        if(userid === interaction.guild.ownerId) return interaction.reply({ content: "You can't ban the owner", ephemeral: true }              );
        
        interaction.guild.members.ban({ user: userid, reason: reason}).catch((e) => {
            interaction.reply({ content: "Failed to ban user", ephemeral: true });
            console.log(e);
        });
        interaction.reply({ content: `Banned ${userid} for ${reason}`, ephemeral: true});

    },
  };
  