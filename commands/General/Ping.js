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

        let days = Math.floor(client.uptime / 86400000)
        let hours = Math.floor(client.uptime / 3600000) % 24
        let minutes = Math.floor(client.uptime / 60000) % 60
        let seconds = Math.floor(client.uptime / 1000) % 60

    // Latency Check
        let webLatency = new Date() - interaction.createdAt
        let apiLatency = client.ws.ping
        let totalLatency = webLatency + apiLatency

    // Emoji
        let emLatency = {
          Green: '<:low_ping:1121648100499525713>',
          Yellow: '<:moderate_ping:1121648026432327720>',
          Red: '<:high_ping:1121647953430466630>'
        }


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
                    name: `📡 Websocket Latency`,
                    value: `${webLatency <= 200 ? emLatency.Green : webLatency <= 400 ? emLatency.Yellow : emLatency.Red} \`${webLatency}\`ms`,
                    inline: true
                },
                {
                    name: `🛰 API Latency`,
                    value: `${apiLatency <= 200 ? emLatency.Green : apiLatency <= 400 ? emLatency.Yellow : emLatency.Red} \`${apiLatency}\`ms`,
                    inline: true
                },
                {
                    name: `⏲ Uptime`,
                    value: `\`${days}Days\` : \`${hours}Hrs\` : \`${minutes}Mins\` : \`${seconds}Secs\``,
                    inline: true
                },
                    {
                        name: "📂︙Database Latency",
                        value: `${result.ok <= 200 ? emLatency.Green : result.ok <= 400 ? emLatency.Yellow : emLatency.Red} \`${result.ok}\`ms(\`${mongooseSeconds}\`s)`,
                        inline: false,
                    }
                ],
                type: 'editreply'
            }, interaction)
        })
    })
    },
  };
  