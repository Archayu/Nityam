const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const moment = require("moment");
require("moment-duration-format");
  module.exports = {
    name: ["uptime"],
    description: "check the bot's uptime",
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
        const duration = moment.duration(client.uptime).format("\`D\` [days], \`H\` [hrs], \`m\` [mins], \`s\` [secs]");
        const upvalue = (Date.now() / 1000 - client.uptime / 1000).toFixed(0);
    
        client.embed({
            title: `↕・Uptime`,
            desc: `See the uptime of Nityam`,
            thumbnail: client.user.displayAvatarURL({ size: 1024 }),
            fields: [
                {
                    name: "⌛┇Uptime",
                    value: `${duration}`,
                    inline: true
                },
                {
                    name: "⏰┇Up Since",
                    value: `<t:${upvalue}>`,
                    inline: true
                }
            ],
            type: 'reply'
        }, interaction)
    },
  };
  