const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ButtonStyle,
    StringSelectMenuOptionBuilder,
  } = require("discord.js");
  const Colors = require("../../Settings/emojis")
  
  module.exports = (client) => {
    client.generateEmbed = async function (start, end, lb, title, interaction) {
        const current = lb.slice(start, end + 10);
        const result = current.join("\n");
        
        let embed = client.templateEmbed()
            .setTitle(`${title}`)
            .setDescription(`${result.toString()}`)
            .setColor(client.color)
            return embed;
        }

      


client.createLeaderboard = async function (title, lb, interaction) {
    interaction.editReply({ embeds: [await client.generateEmbed(0, 0, lb, title, interaction)], fetchReply: true }).then(async msg => {
        if (lb.length <= 10) return;

        let button1 = new ButtonBuilder()
            .setCustomId('back_button')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        let button2 = new ButtonBuilder()
            .setCustomId('forward_button')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Primary);

        let row = new ActionRowBuilder()
            .addComponents(button1, button2);

        msg.edit({ embeds: [await client.generateEmbed(0, 0, lb, title, interaction)], components: [row] })

        let currentIndex = 0;
        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async (btn) => {
            if (btn.user.id == interaction.user.id && btn.message.id == msg.id) {
                btn.customId === "back_button" ? currentIndex -= 10 : currentIndex += 10;

                let btn1 = new ButtonBuilder()
                    .setCustomId('back_button')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);

                let btn2 = new ButtonBuilder()
                    .setCustomId('forward_button')
                    .setEmoji('➡️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);

                if (currentIndex !== 0) btn1.setDisabled(false);
                if (currentIndex + 10 < lb.length) btn2.setDisabled(false);

                let row2 = new ActionRowBuilder()
                    .addComponents(btn1, btn2);

                msg.edit({ embeds: [await client.generateEmbed(currentIndex, currentIndex, lb, title, interaction)], components: [row2] });
                btn.deferUpdate();
            }
        })

        collector.on('end', async (btn) => {
            let btn1Disable = new ButtonBuilder()
                .setCustomId('back_button')
                .setEmoji('⬅️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);

            let btn2Disable = new ButtonBuilder()
                .setCustomId('forward_button')
                .setEmoji('➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);

            let rowDisable = new ActionRowBuilder()
                .addComponents(btn1Disable, btn2Disable);

            msg.edit({ embeds: [await client.generateEmbed(currentIndex, currentIndex, lb, title, interaction)], components: [rowDisable] });
        })
    })
}
  }