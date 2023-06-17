const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  module.exports = {
    name: ["server", "channel-info"],
    description: "get information about a channel",
    category: "Server",
    options: [
        {
            name: "channel",
            description: "channel to get info about",
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: [],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const channel = interaction.options.getChannel('channel');

        client.embed({
            title: `ℹ・Channel information`,
            desc: `Channel information about: <#${channel.id}>`,
            fields: [
                {
                    name: "Type",
                    value: `${ChannelType[channel.type]}`,
                    inline: true,
                },
                {
                    name: "ID",
                    value: `${channel.id}`,
                    inline: true,
                },
                {
                    name: "Type",
                    value: `${channel.type}`,
                    inline: true,
                },
                {
                    name: "Made on",
                    value: `${channel.createdAt}`,
                    inline: true,
                },
                {
                    name: "Subject",
                    value: `${channel.topic ? channel.topic : 'N/A'}`,
                    inline: true,
                },
                {
                    name: "NSFW",
                    value: `${channel.nsfw}`,
                    inline: true,
                },
                {
                    name: "Parent",
                    value: `${channel.parentID ? channel.parentID : 'N/A'}`,
                    inline: true,
                },
            ],
            type: 'reply'
        }, interaction)
    },
  };
  