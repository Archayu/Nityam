const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  CommandInteraction
} = require("discord.js");
const  client  = require("../../bot")

module.exports = {
  name: [""],
  description: "",
  category: "",
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
    sameVoice: false,
  },
      /**
     * @param {CommandInteraction} interaction
     * @param {client} client   
     */
  run: async (interaction, client) => {

  },
};
