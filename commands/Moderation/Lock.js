const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["lock"],
    description: "lock a channel",
    category: "Moderation",
    options: [
        {
            name: "channel",
            description: "channel to lock",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        },
    ],
    permissions: {
      channel: [],
      bot: ["ManageChannels"],
      user: ["ManageChannels"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: false,
        });

        interaction.reply({
            content: `Locked ${channel}`,
            ephemeral: true,
        });

        channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Channel Locked")
                .setDescription(`This channel has been locked by ${interaction.user}`)
                .setColor("Orange")
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL())
            ]
        })

     
    },
  };
  