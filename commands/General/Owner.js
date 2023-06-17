const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  module.exports = {
    name: ["owner"],
    description: "See the Info Abot The Owner",
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
            title: `📘・Owner information`,
            desc: `____________________________`,
            thumbnail: client.user.displayAvatarURL({ dynamic: true, size: 1024 }),
            fields: [{
                name: "👑︙Owner name",
                value: `Ayush`,
                inline: true,
            },
            {
                name: "🏷︙Discord tag",
                value: `Aayu#0552`,
                inline: true,
            },
            {
                name: "🏢︙Organization",
                value: `Sanatani Coders 🕉`,
                inline: true,
            },
            {
                name: "🌐︙Website",
                value: `Soon...`,
                inline: true,
            }],
            type: 'reply'
        }, interaction)
    },
  };
  