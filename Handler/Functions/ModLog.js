const { EmbedBuilder } = require("discord.js");
const modLogModel = require("../../Models/ModLogs");

module.exports = async (client) => {
  client.modLogs = async function (interaction, reason, fields = []) {
    modLogModel.findOne(
      {
        Guild: interaction.guildId,
      },
      async (err, data) => {
        if (err) throw err;
        if (!data || (data && !data.Channel)) return;

        const modLog = interaction.guild.channels.cache.get(data.Channel);
        if (
          modLog &&
          modLog.viewable &&
          modLog
            .permissionsFor(interaction.guild.me)
            .has(["SendMessages", "EmbedLinks"])
        ) {
          const embed = new EmbedBuilder()
            .addFields(
              {
                name: "Moderator",
                value: `${interaction.user || `${client.emoji.Error}`}`,
                inline: true,
              },
              {
                name: "Reason",
                value: reason,
              }
            )
            .setFooter({
              text: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setTimestamp()
            .setColor(client.color);

          embed.addFields(fields);
          return modLog.send({
            embeds: [embed],
          });
        }
      }
    );
  };

  /*
    modLog(interaction, reason, fields = {}) {
        modLogModel.findOne(
            {
                Guild: interaction.guildId,
            },
            async (err, data) => {
                if (err) throw err;
                if (!data || (data && !data.Channel)) return;

                const modLog = interaction.guild.channels.cache.get(
                    data.Channel
                );
                if (
                    modLog &&
                    modLog.viewable &&
                    modLog
                        .permissionsFor(interaction.guild.me)
                        .has(["SEND_MESSAGES", "EMBED_LINKS"])
                ) {
                    const embed = new EmbedBuilder()
                        .addField(
                            "Moderator",
                            `${interaction.user || `${Emoji.Message.ERROR}`}`,
                            true
                        )
                        .setFooter({
                            text: `${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        })
                        .setTimestamp()
                        .setColor(Embed.color);
                    for (const field in fields) {
                        embed.addField(field, fields[field], true);
                    }
                    embed.addField("Reason", reason);
                    modLog.send({
                        embeds: [embed],
                    });
                }
            }
        );
    }
    */
};
