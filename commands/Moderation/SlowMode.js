const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const ms = require("ms");
  module.exports = {
    name: ["slowmode"],
    description: "set the slowmode of a channel",
    category: "Moderation",
    options: [
        {
            name: "time",
            description: "time to set slowmode to",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "channel",
            description: "channel to set slowmode in",
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
        const time = interaction.options.getString("time");
        const timeMS = ms(time);
        if(!timeMS) return interaction.reply({ content: "Invalid time", ephemeral: true });
        if(timeMS > 21600000) return interaction.reply({ content: "Slowmode cannot be longer than 6 hours", ephemeral: true });
        channel.setRateLimitPerUser(timeMS / 1000).catch((e) => {
            interaction.reply({ content: "Failed to set slowmode", ephemeral: true });
            console.log(e);
        }
        );
        interaction.reply({ content: `Set slowmode to ${time} in ${channel}`, ephemeral: true });
        client.modLogs({ interaction, reason: "Not Required", fields: [
          {
              name: "Action",
              value: "SlowMode",
              inline: true
          },
          {
              name: "Target",
              value: `${channel}`
          }
      ]})
        
    },
  };
  