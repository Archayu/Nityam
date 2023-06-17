const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const configs = require("../../Models/Leveling");
  module.exports = {
    name: ["level", "announce", "toggle"],
    description: "level up message toggle enable/disable",
    category: "Leveling",
    options: [
        {
            name: "toggle",
            description: "toggle on/off",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "ON", value: "on",
                },
                {
                    name: "OFF", value: "off"
                }
            ]
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
        const toggle = interaction.options.getString("toggle");

        const  data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id })
        if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );

        
        if(toggle === "on") {
            if (data.xpLevelUp.xp) return             
            client.errNormal({ 
                error: `XP level up message is already enabled`,
                type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
            }, interaction);


            
            client.succNormal({ 
                text: `XP level up message is now enabled`,
                type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
            }, interaction);

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.enable": true })
        } else {
            if (!data.xpLevelUp.xp) return             
            client.errNormal({ 
                error: `XP level up message is already disabled`,
                type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
            }, interaction);


            
            client.succNormal({ 
                text: `XP level up message is now disabled`,
                type: 'ephemeral' //editreply, reply, update, ephemeraledit, ephemeral 
            }, interaction);

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.enable": false })
        }
    },
  };
  