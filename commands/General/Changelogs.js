const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  module.exports = {
    name: ["changelogs"],
    description: "See The Bot's New Changelogs",
    category: "General",
    options: [],
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
        client.embed({
            title: "📇・Changelogs",
            desc: `_____`,
            thumbnail: client.user.displayAvatarURL({ size: 1024 }),
            fields: [{
                    name: "📢︙Alert!",
                    value: 'no change logs found',
                    inline: false,
                },
            ],
            type: 'reply'
        }, interaction)
    },
  };
  