const { WebhookClient, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const config = require("../../Settings/config")
const moment = require("moment");

module.exports = async (client, guild) => {
    /*
    
    } else {*/
    const members = guild.memberCount;
    if (members < 40) {
        let owner = await guild.fetchOwner();
        owner.send({ content: "Your Guild Membes Are Less Than 40 This Might Be A Fake Guild So Leaving It." })
        setTimeout(() => {
            guild.leave()
        })
    }

    const channel = new WebhookClient({
        url: `${config.webhook.join}`
    })
    
    let own = await guild.fetchOwner();

    const invite = await guild.channels.cache.find(
        (c) =>
            c.type === ChannelType.GuildText &&
            c.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite && PermissionFlagsBits.SendMessages)
    );

    let inviteLink = await invite.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => {});

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `Joined a Server!`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields([
            { name: "Name", value: `\`\`\`${guild.name}\`\`\``, inline: true },
            { name: "ID", value: `\`\`\`${guild.id}\`\`\``, inline: true },
            { name: "Member Count", value: `\`\`\`${guild.memberCount} Members\`\`\``, inline: true },
            {
                name: "Owner",
                value: `\`\`\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"} | ${
                    own.id
                }\`\`\``,
            },
            { name: "Creation Date", value: `\`\`\`${moment.utc(guild.createdAt).format("DD/MMM/YYYY")}\`\`\`` },
            { name: `${client.user.username}'s Server Count`, value: `\`\`\`${client.guilds.cache.size} Servers\`\`\`` },
        ])
        .setColor(client.color)
        .setTimestamp();

    if (guild.iconURL()) {
        embed.setThumbnail(guild.iconURL({ size: 2048 }));
    } else {
        embed.setThumbnail(client.user.displayAvatarURL({ size: 2048 }));
    }

    if (guild.bannerURL()) {
        embed.setImage(guild.bannerURL());
    } else {
        embed.setImage(client.config.bannerUrl);
    }

    if (inviteLink) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel(`${guild.name} Invite Link`).setStyle(ButtonStyle.Link).setURL(`${inviteLink}`)
        );

        channel.send({ embeds: [embed], components: [row] });
    } else {
        channel.send({ embeds: [embed] });
    }
    }

//}