const {StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder, } = require("discord.js");
const { readdirSync } = require("fs");
module.exports = {
    name: ["help"],
    description: "get info about the all commands available",
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
        await interaction.deferReply({ ephemeral: false });
        
        const categories = readdirSync("./commands/")
        //Function Uptime
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

        const embed = new EmbedBuilder()
            .setColor(client.color)
           .setImage("https://cdn.discordapp.com/attachments/1119841356894961744/1123559755005308978/1687653663474.jpg")
            .setDescription(`Hello I m Nityam and I Am Very Powerfull Bot That You Can Use\n My Main Features Are Antinuke, Music, Suggestion, Leveling(XP) and Giveaways.\nBut I can do more than that. Some Extra Features Are Guild Economy, Clan System, Moderation, General, and More!\n\nPrefix: \`/\`\nTotal Commands: \`${client.slash.size}\`\nTotal Categories: \`${categories.length}\`\nUptime: \`${days}Days\` : \`${hours}Hrs\` : \`${minutes}Mins\` : \`${seconds}Secs\`\n**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=988355498371842108&permissions=8&scope=bot%20applications.commands)\n**\Websocket Latency: ${webLatency <= 200 ? emLatency.Green : webLatency <= 400 ? emLatency.Yellow : emLatency.Red} \`${webLatency}\`ms\nAPI Latency: ${apiLatency <= 200 ? emLatency.Green : apiLatency <= 400 ? emLatency.Yellow : emLatency.Red} \`${apiLatency}\`ms`)

        const row = new ActionRowBuilder()
            .addComponents([
                new StringSelectMenuBuilder()
                    .setCustomId("help-category")
                    .setPlaceholder(`Please Select Category Menu!`)
                    .setMaxValues(1)
                    .setMinValues(1)
                    /// Map the categories to the select menu
                    .setOptions(categories.map(category => {
                        return new StringSelectMenuOptionBuilder()
                            .setLabel(category)
                            .setValue(category)
                        }
                    ))
                ])

            interaction.editReply({ embeds: [embed], components: [row] }).then(async (msg) => {
                let filter = (i) => (i.isStringSelectMenu()) && i.user && i.message.author.id == client.user.id;
                let collector = await msg.createMessageComponentCollector({ 
                    filter,
                    time: 90000 
                });
                collector.on('collect', async (m) => {
                    if(m.isStringSelectMenu()) {
                        if(m.customId === "help-category") {
                            await m.deferUpdate();
                            let [directory] = m.values;

                            const embed = new EmbedBuilder()
                                .setAuthor({ name: `${interaction.guild.members.me.displayName} Help Command!`, iconURL: interaction.guild.iconURL({ dynamic: true })})
                                .setDescription(`The bot prefix is: \`/\``)
                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                .setColor(client.color)
                                .addFields({ name: `❯  ${directory.toUpperCase()} [${client.slash.filter(c => c.category === directory).size}]`, value: `${client.slash.filter(c => c.category === directory).map(c => `\`${c.name.at(-1)}\``).join(", ")}`, inline: false })
                                .setFooter({ text: `© ${interaction.guild.members.me.displayName} | Total Commands: ${client.slash.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

                            msg.edit({ embeds: [embed] });
                        }
                    }
                });

            collector.on('end', async (collected, reason) => {
                if(reason === 'time') {
                    const timed = new EmbedBuilder()
                    .setDescription(`Help Menu timed out try using /help again.`)
                    .setColor(client.color)

                    msg.edit({ embeds: [timed], components: [] });
                }
            });
        })
    },
  };
  