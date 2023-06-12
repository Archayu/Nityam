const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const configs = require("../../Models/Leveling");
  
  module.exports = {
    name: ["level", "xp", "rate"],
    description: "Change the XP rate of your server",
    category: "Leveling",
    options: [
        {
             name: "xp-rate",
             description: "The Percentage Of The XP",
             required: true,
             type: ApplicationCommandOptionType.Integer,
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageGuild"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {

      const rate = interaction.options.getInteger("xp-rate"),
      data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });
      if (rate < 0 || rate > 1000) return   client.errNormal({ 
        error: `Please provide valid XP Rate from 1% to 1000% ( you don't have to type % just the number will work )`,
        type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
    }, interaction);

    if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );
    
    client.succNormal({ 
      text: `XP rate is change to ${rate}%`,
      type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
  }, interaction);

  await configs.findOneAndUpdate({ id: interaction.guild.id }, { xpRate: rate / 100 }) 
    },
  };
  