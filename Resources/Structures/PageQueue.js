const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const SlashPage = async (client, message, pages, timeout, queueLength, queueDuration) => {
    if (!message && !message.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');

    const button = client.button.queue_page;

    const row1 = new ButtonBuilder()
        .setCustomId('back')
        .setLabel(`${button.back.label}`)
        .setEmoji(`${button.back.emoji}`)
        .setStyle(ButtonStyle[button.back.style])
    const row2 = new ButtonBuilder()
        .setCustomId('next')
        .setLabel(`${button.next.label}`)
        .setEmoji(`${button.next.emoji}`)
        .setStyle(ButtonStyle[button.next.style])
    const row = new ActionRowBuilder()
        .addComponents(row1, row2)

    let page = 0;
    let footer = `Page • ${page + 1}/${pages.length} | ${queueLength} • Song | ${queueDuration} • Total duration`
    const curPage = await message.editReply({ embeds: [pages[page].setFooter({ text: footer })], components: [row], allowedMentions: { repliedUser: false } });
    if(pages.length == 0) return;

    const filter = (m) => m.user.id === message.user.id;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
            if(!interaction.deferred) await interaction.deferUpdate();
            if (interaction.customId === 'back') {
                page = page > 0 ? --page : pages.length - 1;
            } else if (interaction.customId === 'next') {
                page = page + 1 < pages.length ? ++page : 0;
            }
             footer = `Page • ${page + 1}/${pages.length} | ${queueLength} • Song | ${queueDuration} • Total duration  `
            curPage.edit({ embeds: [pages[page].setFooter({ text: footer })], components: [row] })
        });

    collector.on('end', () => {
        const disabled = new ActionRowBuilder()
            .addComponents(row1.setDisabled(true), row2.setDisabled(true))
        curPage.edit({ embeds: [pages[page].setFooter({ text: footer })], components: [disabled] })
    });

    return curPage;
};

const SlashPlaylist = async (client, message, pages, timeout, queueLength) => {
    if (!message && !message.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');

    const button = client.button.playlist_page;

    const row1 = new ButtonBuilder()
        .setCustomId('back')
        .setLabel(`${button.back.label}`)
        .setEmoji(`${button.back.emoji}`)
        .setStyle(ButtonStyle[button.back.style])
    const row2 = new ButtonBuilder()
        .setLabel(`${button.next.label}`)
        .setEmoji(`${button.next.emoji}`)
        .setStyle(ButtonStyle[button.next.style])
    const row = new ActionRowBuilder()
        .addComponents(row1, row2)

    let page = 0;
    let footer =   `Page • ${page + 1}/${pages.length} | ${queueLength} • Playlists`
    const curPage = await message.editReply({ embeds: [pages[page].setFooter({ text: footer })], components: [row], allowedMentions: { repliedUser: false } });
    if(pages.length == 0) return;

    const filter = (m) => m.user.id === message.user.id;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
            if(!interaction.deferred) await interaction.deferUpdate();
            if (interaction.customId === 'back') {
                page = page > 0 ? --page : pages.length - 1;
            } else if (interaction.customId === 'next') {
                page = page + 1 < pages.length ? ++page : 0;
            }
            footer =   `Page • ${page + 1}/${pages.length} | ${queueLength} • Playlists`
            curPage.edit({ embeds: [pages[page].setFooter({ text: footer })], components: [row] })
        });
    collector.on('end', () => {
        const disabled = new ActionRowBuilder()
            .addComponents(row1.setDisabled(true), row2.setDisabled(true))
        curPage.edit({ embeds: [pages[page].setFooter({ text: footer })], components: [disabled] })
    });
    return curPage;
};

module.exports = { SlashPage, SlashPlaylist };