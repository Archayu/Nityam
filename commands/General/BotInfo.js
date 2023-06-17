const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");
  module.exports = {
    name: ["botinfo"],
    description: "get information Abot The Bot",
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
        await interaction.deferReply();
        const promises = [
            client.shard.broadcastEval(client => client.guilds.cache.size),
            client.shard.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
            client.shard.broadcastEval(client => client.channels.cache.size),
            client.shard.broadcastEval(client => client.voice.adapters.size)
        ];
        return Promise.all(promises)
            .then(async results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                const totalChannels = results[2].reduce((acc, channelCount) => acc + channelCount, 0);
                const totalVoice = results[3].reduce((acc, voiceCount) => acc + voiceCount, 0);
    
                const duration = moment.duration(client.uptime).format("\`D\` [days], \`H\` [hrs], \`m\` [mins], \`s\` [secs]");
    
                client.embed({
                    title: `ℹ・Bot information`,
                    desc: `____________________________`,
                    thumbnail: client.user.displayAvatarURL({ size: 1024 }),
                    fields: [
                   {
                        name: "ℹ️︙Information",
                        value: `Nityam is a bot with which you can run your entire server! With no less than 100+ commands, we have a large bot with many options to improve your server!`,
                        inline: false,
                    },
                    {
                        name: "_____ \n\n│General",
                        value: `_____`,
                        inline: false,
                    },
                    {
                        name: "🤖︙Bot name",
                        value: `${client.user.username}`,
                        inline: true,
                    },
                    {
                        name: "🆔︙Bot id",
                        value: `${client.user.id}`,
                        inline: true,
                    },
                    {
                        name: "💻︙Shards",
                        value: `\`${client.options.shardCount}\` shards`,
                        inline: true,
                    },
                    {
                        name: "🔧︙Bot owner",
                        value: `<@!1051806381461745664> `,
                        inline: true,
                    },
                    {
                        name: "💻︙Commands",
                        value: `\`${client.slash.size}\` commands`,
                        inline: true,
                    },
                    {
                        name: "🌐︙Servers",
                        value: `\`${totalGuilds}\` servers`,
                        inline: true,
                    },
                    {
                        name: "🌐︙Servers this shard",
                        value: `\`${client.guilds.cache.size}\` servers`,
                        inline: true,
                    },
                    {
                        name: "👥︙Members",
                        value: `\`${totalMembers}\` members`,
                        inline: true,
                    },
                    {
                        name: "🔊︙Connected channels",
                        value: `\`${totalVoice}\` channels`,
                        inline: true,
                    },
                    {
                        name: "📺︙Channels",
                        value: `\`${totalChannels}\` channels`,
                        inline: true,
                    },
                    {
                        name: "📅︙Created",
                        value: `<t:${Math.round(client.user.createdTimestamp / 1000)}>`,
                        inline: true,
                    },
    
                    {
                        name: "_____ \n\n│System",
                        value: `_____`,
                        inline: false,
                    },
                    {
                        name: "🆙︙Uptime",
                        value: `${duration}`,
                        inline: true,
                    },
                    {
                        name: "⌛︙API speed:",
                        value: `\`${client.ws.ping}\`ms`,
                        inline: true,
                    },
                    {
                        name: "🏷︙Bot Version",
                        value: `\`${require(`${process.cwd()}/package.json`).version}\``,
                        inline: true,
                    },
                    {
                        name: "🏷︙Node.js Version",
                        value: `\`${process.version}\``,
                        inline: true,
                    },
                    {
                        name: "📂︙Discord.js Version",
                        value: `\`${Discord.version}\``,
                        inline: true,
                    },
                    {
                        name: "💾︙Bot memory",
                        value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}\` MB`,
                        inline: true,
                    },
                    ],
                    type: 'editreply'
                }, interaction)
            
            })
    },
  };
  