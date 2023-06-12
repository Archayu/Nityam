const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    GuildPremiumTier
  } = require("discord.js");
  module.exports = {
    name: ["server", "info"],
    description: "get the info about the server",
    category: "Server",
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
        await interaction.deferReply();
        let verifLevels = {
             None: "None",
             Low: "Low",
             Medium: "Medium",
             High: "(╯°□°）╯︵  ┻━┻",
             VeryHigh : "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
          }

          let tier = {
            Tier1: `1`,
            Tier2: `2`,
            Tier3: `3`,
             None: `0`,
          }

          const members = await interaction.guild.members.fetch();

  client.embed({
    title: `ℹ️・Server Information`,
    desc: `Information about the server ${interaction.guild.name}`,
    thumbnail: interaction.guild.iconURL({ dynamic: true, size: 1024 }),
    image: interaction.guild.bannerURL({ size: 1024 }),
    fields: [
      {
        name: "Server name:",
        value: `${interaction.guild.name}`,
        inline: true,
      },
      {
        name: "Server id:",
        value: `${interaction.guild.id}`,
        inline: true,
      },
      {
        name: "Owner: ",
        value: `<@!${interaction.guild.ownerId}>`,
        inline: true
      },
      {
        name: "Verify level: ",
        value: `${verifLevels[interaction.guild.verificationLevel]}`,
        inline: true
      },
      {
        name: "Boost tier: ",
        value: `Tier ${tier[interaction.guild.premiumTier] || 'None'}`,
        inline: true
      },
      {
        name: "Boost count:",
        value: `${interaction.guild.premiumSubscriptionCount || '0'} boosts`,
        inline: true
      },
      {
        name: "Created on:",
        value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`,
        inline: true
      },
      {
        name: "Members:",
        value: `${interaction.guild.memberCount} members!`,
        inline: true
      },
      {
        name: "Bots:",
        value: `${members.filter(member => member.user.bot).size} bots!`,
        inline: true
      },
      {
        name: "Text Channels: ",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size} channels!`,
        inline: true
      },
      {
        name: "Voice Channels:",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size} channels!`,
        inline: true
      },
      {
        name: "Stage Channels:",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildStageVoice).size} channels!`,
        inline: true
      },
      {
        name: "News Channels:",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildAnnouncement).size} channels!`,
        inline: true
      },
      {
        name: "Forum Channels:",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildForum).size} threads!`,
        inline: true
      },
      {
        name: "Public Threads:",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.PublicThread).size} threads!`,
        inline: true
      },
      {
        name: "Private Threads:",
        value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.PrivateThread).size} threads!`,
        inline: true
      },
      {
        name: "Roles:",
        value: `${interaction.guild.roles.cache.size} roles!`,
        inline: true
      },
      {
        name: "Emoji count:",
        value: `${interaction.guild.emojis.cache.size} emoji's`,
        inline: true
      },
      {
        name: "Sticker count:",
        value: `${interaction.guild.stickers.cache.size} stickers`,
        inline: true
      }
    ],
    type: 'editreply'
  }, interaction)
       
    },
  };
  