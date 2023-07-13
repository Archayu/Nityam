const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction
  } = require("discord.js");
  const  client  = require("../../bot")
  const Schema = require("../../Models/Self-Roles")
  module.exports = {
    name: ["self-roles", "delete"],
    description: "deletes a self role catefgory ",
    category: "Self-Roles",
    options: [
      {
        name: "category",
        description: "The category to delete",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ],
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
      sameVoice: false,
    },
        /**
       * @param {CommandInteraction} interaction
       * @param {client} client   
       */
    run: async (interaction, client) => {

      await interaction.deferReply({ ephemeral: true });
      const category = interaction.options.getString("category")

      Schema
      .findOne({ Guild: interaction.guild.id, Category: category }, async (err, data) => {
        if(!data) return interaction.followUp({ content: "That category doesn't exist" })
        await Schema.findOneAndDelete({ Guild: interaction.guild.id, Category: category })
        interaction.followUp({ content: `Deleted the category ${category}` })
      }
      );
      

  
    },
  };
  