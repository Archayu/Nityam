const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  module.exports = {
    name: ["unlock"],
    description: "Unlock a channel",
    category: "Moderation",
    options: [
        {
            name: "channel",
            description: "channel to unlock",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
        }
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
            SendMessages: true,
        });
         interaction
        .reply({
            content: `Unlocked ${channel}`,
            ephemeral: true,
        });
        
    },
  };
  