const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  CommandInteraction,
  Client
} = require("discord.js");
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
  },
      /**
     * @param {CommandInteraction} interaction
     * @param {Client} client   
     */
  run: async (interaction, client) => {},
};
