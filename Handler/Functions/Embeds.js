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

    
    client.templateEmbed = function() {
        return new EmbedBuilder()
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.avatarURL({ size: 1024 })
            })
            .setColor(client.color)
            .setFooter({
                text: `Nityam Made With 🚩 By Ayush`,
                iconURL: client.user.avatarURL({ size: 1024 })
            })
            .setTimestamp();
    }

    //----------------------------------------------------------------//
    //                        ERROR MESSAGES                          //
    //----------------------------------------------------------------//

    // Normal error 
    client.errNormal = async function ({
        embed: embed = client.templateEmbed(),
        error: error,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`${Colors.Error}・Error!`)
        embed.setDescription(`Something went wrong!`)
        embed.addFields(
            {
                 name: `Error`, value: `\`\`\`${error}\`\`\``, inline: true
            }
            )
        embed.setColor(client.color)

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

  

    //----------------------------------------------------------------//
    //                        SUCCES MESSAGES                         //
    //----------------------------------------------------------------//

    // Normal succes
    client.succNormal = async function ({
        embed: embed = client.templateEmbed(),
        text: text,
        fields: fields,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`${Colors.Success}・Success!`)
        embed.setDescription(`${text}`)
        embed.setColor(client.color)

        if (fields) embed.addFields(fields);

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    //----------------------------------------------------------------//
    //                        BASIC MESSAGES                          //
    //----------------------------------------------------------------//

    // Default
    client.embed = async function ({
        embed: embed = client.templateEmbed(),
        title: title,
        desc: desc,
        color: color,
        image: image,
        author: author,
        url: url,
        footer: footer,
        thumbnail: thumbnail,
        fields: fields,
        content: content,
        components: components,
        type: type
    }, interaction) {
        if (interaction.guild == undefined) interaction.guild = { id: "0" };
        

        if (title) embed.setTitle(title);
        if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + "...");
        else if (desc) embed.setDescription(desc);
        if (image) embed.setImage(image);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (fields) embed.addFields(fields);
        if (author) embed.setAuthor(author);
        if (url) embed.setURL(url);
        if (footer) embed.setFooter(footer);
        if (color) embed.setColor(color);
        

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    client.simpleEmbed = async function ({
        title: title,
        desc: desc,
        color: color,
        image: image,
        author: author,
        thumbnail: thumbnail,
        fields: fields,
        url: url,
        content: content,
        components: components,
        type: type
    }, interaction) {
        

        let embed = new EmbedBuilder()
            .setColor(client.color)

        if (title) embed.setTitle(title);
        if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + "...");
        else if (desc) embed.setDescription(desc);
        if (image) embed.setImage(image);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (fields) embed.addFields(fields);
        if (author) embed.setAuthor(author[0], author[1]);
        if (url) embed.setURL(url);
        if (color) embed.setColor(color);
    

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    client.sendEmbed = async function ({
        embeds: embeds,
        content: content,
        components: components,
        type: type
    }, interaction) {
        if (type && type.toLowerCase() == "edit") {
            return await interaction.edit({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "editreply") {
            return await interaction.editReply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "reply") {
            return await interaction.reply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "update") {
            return await interaction.update({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "ephemeraledit") {
            return await interaction.editReply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true,
                ephemeral: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "ephemeral") {
            return await interaction.reply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true,
                ephemeral: true
            }).catch(e => { });
        }
        else {
            return await interaction.send({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
    }
}