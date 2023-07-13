const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction,
    Client
  } = require("discord.js");
  const Schema = require("../../Models/User_Exp")
  const configs = require("../../Models/Leveling");
  module.exports = {
    name: ["level", "set"],
    description: "Set Level Of The User",
    category: "Leveling",
    options: [
        {
            name: "user",
            description: 'user to set the level of',
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: "level",
            description: "level to set",
            required: true,
            type: ApplicationCommandOptionType.Integer
        },
        {
            name: "xp",
            description: "xp to set (optional)",
            required: false,
            type: ApplicationCommandOptionType.Integer
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["Administrator"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
      sameVoice: false,
      isPlayer: false,
    },
        /**
       * @param {CommandInteraction} interaction
       * @param {Client} client   
       */
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
        interaction.deferReply();

        const User = interaction.options.getUser("user"),
        Level = interaction.options.getInteger("level");
        const xp = interaction.options.getInteger("xp");

       
        const Data = Schema.findOne({ user: User.id, guild: interaction.guild.id })
       
        if (Data) {


            if (xp) {
                let reqXP = 100;
    
            for (let i = 1; i <= Data.level; i++)reqXP += 5 * (i ^ 2) + (50 * i) + 100;
            if(xp >= reqXP) {  client.errNormal(
                {
                  error: `Xp Cannot Be Higher Than Required Xp`,
                  type: "editreply", //editreply, reply, update, ephemeraledit, ephemeral
                },
                interaction
              ) 
            } else {

              Data.level = Level,
              Data.xp = xp
              await Data.save()
              }
            } else {

            

            Data.level = Level
           await Data.save()
            }
        } else if(!Data) {
            Schema.create({
                user: User.id,
                guild: interaction.guild.id,
                level: Level
            })
        }

        
        client.succNormal({ 
            text: `Successfully Setted The ${User.username}'s Level To \`${Level}\``,
            type: 'editreply' //editreply, reply, update, ephemeraledit, ephemeral 
        }, interaction);
    },
  };
  