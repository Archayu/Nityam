const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const configs = require("../../Models/Leveling");

  module.exports = {
    name: ["level", "announce", "channel"],
    description: "set the level up announcement channel",
    category: "Leveling",
    options: [
        {
            name: "channel",
            description: "channel to set",
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
            required: true
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageChannels", "Administrator"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const  data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });

        if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );
        const channel = interaction.options.getChannel("channel")

        data.xpLevelUp.channel = channel.id
       await data.save();

        client.succNormal({ 
            text: `Levelup Announcement Channel Is Set To ${channel}`,
            type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
        }, interaction);



    },
  };
  