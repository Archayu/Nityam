const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const configs = require("../../Models/Leveling");
  module.exports = {
    name: ["level", "limit"],
    description: "Change the XP icrement limits for your server",
    category: "Leveling",
    options: [
        {
            name: "up-limit",
            type: 4,
            required: false,
            description: "The maximum XP increment"
        }, {
            name: "down-limit",
            type: 4,
            required: false,
            description: "The minimum XP increment"
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

        const ul = interaction.options.getInteger("up-limit");
        const dl = interaction.options.getInteger("down-limit"),
        data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });

        if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );

        if (dl > ul || ul < 0 || ul > 1000 || dl < 0 || dl > 1000) return   client.errNormal({ 
            error: `Please provide valid XP increment limits from 1 to 1000 and up limit should be more than down limit`,
            type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
        }, interaction);

        if (!dl && !ul) return   client.errNormal({ 
            error: `Please provide either of the XP increment limit i.e. up or down`,
            type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
        }, interaction);

        ul = ul || data.xpLimit.up;
        dl = dl || data.xpLimit.down;

        
        client.succNormal({ 
            text: `XP increment is change to:\nup limit: ${ul}\ndown limit: ${dl}`,
            type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
        }, interaction);

        await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLimit.up": ul, "xpLimit.down": dl })
    },
  };
  