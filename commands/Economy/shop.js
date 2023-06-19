const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction,
    Client
  } = require("discord.js");
const Member = require("../../Models/member");
const EconomyConfig = require("../../Resources/Structures/EconomyConfig");
  module.exports = {
    name: ["economy", "shop", "list"],
    description: "show a item from a shop",
    category: "Economy",
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
    run: async (interaction, client) => {
        interaction.deferReply();
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setDescription(`
        \`work-speed\` - ${numberWithCommas(config.shop.work_reduce_cost)} coins - Reduce work cooldown by ${config.shop.reduce_work_cooldown} seconds.
        \`work-multiple\` - ${numberWithCommas(config.shop.work_multiple_cost)} coins - Increase work money multiple by x${config.shop.work_multiple}.
        \`crime-speed\` - ${numberWithCommas(config.shop.crime_reduce_cost)} coins - Reduce crime cooldown by ${config.shop.reduce_crime_cooldown} seconds.
        \`crime-multiple\` - ${numberWithCommas(config.shop.crime_multiple_cost)} coins - Increase crime money multiple by x${config.shop.crime_multiple}.
        \`rob\` - ${numberWithCommas(config.shop.rob_cost)} coins - Buy rob.
        \`rob-speed\` - ${numberWithCommas(config.shop.rob_reduce_cost)} coins - Reduce rob cooldown by ${config.shop.reduce_rob_cooldown} seconds.
        `)
        .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },
  };
  
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}