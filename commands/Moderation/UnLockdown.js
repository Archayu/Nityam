const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["unlockdown"],
    description: "unlock all channels in the guild",
    category: "Moderation",
    options: [
        {
            name: "ignored-channel",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "ignored-channel-2",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,

        },
        {
            name: "ignored-channel-3",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,

        },
        {
            name: "ignored-channel-4",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,

        },
        {
            name: "ignored-channel-5",
            description: "channels to ignore",
            type: ApplicationCommandOptionType.Channel,
            required: false,
        }
    ],
    permissions: {
      channel: [],
      bot: ["ManageChannels"],
      user: ["Administrator"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const ignoredChannel = interaction.options.getChannel("ignored-channel") || "0",
        ignoredChannel2 = interaction.options.getChannel("ignored-channel-2") || "0",
        ignoredChannel3 = interaction.options.getChannel("ignored-channel-3") || "0",
        ignoredChannel4 = interaction.options.getChannel("ignored-channel-4") || "0",
        ignoredChannel5 = interaction.options.getChannel("ignored-channel-5") || "0";

        await interaction.deferReply({
            ephemeral: true,
        });
         
        const confirm = new EmbedBuilder() 
        .setTitle("Unlocked")
        .setDescription(`Unlocked all channels in the guild`)
        .setColor("Green")
        .setTimestamp()
        .setFooter(`Unlocked by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        interaction.guild.channels.cache.forEach(async (channel) => {
            if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement) {
                if (channel.id === ignoredChannel.id || channel.id === ignoredChannel2.id || channel.id === ignoredChannel3.id || channel.id === ignoredChannel4.id || channel.id === ignoredChannel5.id) return;
                await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: true,
                    ViewChannel: true,
                });
            }
        }).catch((err) => {
            console.log(err);
        }
        );
        await interaction.editReply({
            embeds: [confirm],
        });
        
        client.modLogs({ interaction, reason: "Not required", fields: [
            {
                name: "Action",
                value: "Unlocking Down Guild",
                inline: true
            }
        ]})
    },
  };
  