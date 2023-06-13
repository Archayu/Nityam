const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
const ttt = require('discord.tictactoegame');
const game = new ttt();


  module.exports = {
    name: ["games", "ttt"],
    description: "play tic tac toe",
    category: "Games",
    options: [
        {
          
            name: "user",
            required: false,
            description: "The User Whom You Want To Play With",
            type: ApplicationCommandOptionType.User
          
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
    },
    run: async (interaction, client) => {

      const User = interaction.options.getUser("user")
      if (User && User.bot) return interaction.reply({ content: "You can not play the game with bots" })

     
      interaction.reply({ content: `The game is started` });

      if (!User) game.solo(interaction, client)
      else game.duo(interaction, User);

    },
  };
  