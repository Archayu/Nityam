const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["ban"],
    description: "ban a user in a guild",
    category: "Moderation",
    options: [
        {
            name: "user",
            description: "user to ban",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "reason for ban",
            type: ApplicationCommandOptionType.String,
            required: false,

        },
        {
            name: "days",
            description: "days of messages to delete",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            choices: [
                {
                    name: "1 day",
                    value: 1,
                },
                {
                    name: "2 days",
                    value: 2,
                },
                {
                    name: "3 days",
                    value: 3,
                },
                {
                    name: "4 days",
                    value: 4,
                },
                {
                    name: "5 days",
                    value: 5,
                },
                {
                    name: "6 days",
                    value: 6,
                },

            
            ],
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
        const user = interaction.options.getUser("user");
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) return interaction.reply("User not found");
        if (!member.bannable) return interaction.reply({ content: "I can't ban this user", ephemeral: true });
        if(member.id === interaction.user.id) return interaction.reply({ content: "You can't ban yourself", ephemeral: true });
        if(member.id === client.user.id) return interaction.reply({ content: "You can't ban me", ephemeral: true});
        if(member.id === interaction.guild.ownerId) return interaction.reply({ content: "You can't ban the owner", ephemeral: true });
        if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: "You can't ban this user", ephemeral: true });
        if(member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.reply({ content: "I can't ban this user", ephemeral: true });
        const reason = interaction.options.getString("reason") || "No reason provided";
        const days = interaction.options.getInteger("days") || 0;
        await member.ban({ reason, deleteMessageSeconds: days }).catch((err) => {
            console.log(err);
            interaction.reply("Something went wrong");
        }) 
        interaction.reply({ content: `<:ban:1121649320509325393> Banned ${user.tag} for ${reason}`,});

       
        
        
        
        client.modLogs({ interaction, reason, fields: [
            {
                name: "Action",
                value: "Ban",
                inline: true
            },
            {
                name: "Target",
                value: `${user.username}`
            }
        ]})

    },
  };
  