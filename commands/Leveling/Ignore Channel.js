const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const configs = require("../../Models/Leveling");
  module.exports = {
    name: ["level", "ingnore", "channel"],
    description: "Add/Remove Ignore Channel For Gaining XP",
    category: "Leveling",
    options: [
        {
            
                name: "channel",
                description: "channel to add/remove",
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
                required: true
            
        },
        {
            name: "toggle",
            description: "select add or remove",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Add", value: "add"
                },
                {
                    name: "Remove", value: "remove"
                }
            ]
        }

    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageChannels"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const  data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id }),
         channel = interaction.options.getChannel("channel"),
         toggle = interaction.options.getString("toggle")

         if (!data.xp)
        return client.errNormal(
          {
            error: `Text Leveling System Is Disabled`,
            type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
          },
          interaction
        );
         await interaction.deferReply({ ephemeral: true})

         if(toggle === "add") {

            if (data.ignoreXP.includes("channel"))
                return interaction.editReply({ content: "Yo nerd this channel is already disabled for xp increment" });

            interaction.editReply({ content: "Now the mentioned channel will not get xp incremenets" });
            await configs.findOneAndUpdate({ id: interaction.guild.id }, { $push: { ignoreXP: channel.id } })
         } else {

            if (!data.ignoreXP.includes("channel"))
                return interaction.editReply({ content: "Yo nerd, this channel is not disabled for xp increment" });

            interaction.editReply({ content: "Now the mentioned channel will get xp incremenets" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { $pull: { ignoreXP: channel.id } })
         }
    },
  };
  