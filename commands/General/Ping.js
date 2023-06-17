const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const mongoose = require('mongoose');

  module.exports = {
    name: ["ping"],
    description: "check the ping of the bot",
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
      client.simpleEmbed({
        desc: `Calculating ping...`,
        type: 'reply'
    }, interaction).then((resultMessage) => {
        const ping = Math.floor(resultMessage.createdTimestamp - interaction.createdTimestamp);

        mongoose.connection.db.admin().ping(function (err, result) {

            var mongooseSeconds = ((result.ok % 60000) / 1000);
            var pingSeconds = ((ping % 60000) / 1000);
            var apiSeconds = ((client.ws.ping % 60000) / 1000);

            client.embed({
                title: `🏓・Pong`,
                desc: `Check out how fast our bot is`,
                thumbnail: client.user.displayAvatarURL({ size: 1024 }),
                fields: [
                    {
                        name: "🤖︙Bot latency",
                        value: `\`${ping}\`ms (\`${pingSeconds}\`s)`,
                        inline: false,
                    },
                    {
                        name: "💻︙API Latency",
                        value: `\`${client.ws.ping}\`ms (\`${apiSeconds}\`s)`,
                        inline: false,
                    },
                    {
                        name: "📂︙Database Latency",
                        value: `\`${result.ok}\`ms (\`${mongooseSeconds}\`s)`,
                        inline: false,
                    }
                ],
                type: 'editreply'
            }, interaction)
        })
    })
    },
  };
  