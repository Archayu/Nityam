const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["kick"],
    description: "kick a user in a guild",
    category: "Moderation",
    options: [
        {
            name: "user",
            description: "user to kick",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "reason for kick",
            type: ApplicationCommandOptionType.String,
            required: false,
        },

    ],
    permissions: {
      channel: [],
      bot: ["KickMembers"],
      user: ["KickMembers"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason provided";
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) return interaction.reply({ content: "User not found", ephemeral: true});
        if (!member.kickable) return interaction.reply({ content: "User is not kickable", ephemeral: true});
        if (member.id === interaction.guild.ownerId) return interaction.reply({ content: "User is the guild owner", ephemeral: true});
        if (member.id === client.user.id) return interaction.reply({ content: "You can't kick me", ephemeral: true});
        if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: "User has a higher or equal role position than You", ephemeral: true});
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.reply({ content: "User has a higher or equal role position than me", ephemeral: true});
        if (member.id === interaction.member.id) return interaction.reply({ content: "You can't kick yourself", ephemeral: true});
        member.kick(reason);
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Kick")
                .setDescription(`Kicked ${user.tag} (${user.id})`)
                .setColor("Red")
                .setTimestamp()
                .setFooter(`Kicked by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            ]

        }).catch((err)=>{ console.log(err)
        interaction.channel.send({ content: `An error occured: ${err}\n Please report this to the developer`})
    }
        );
    },
  };
  