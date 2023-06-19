const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction,
    Client
  } = require("discord.js");
  const Clan = require("../../Models/clan.js");
const Member = require("../../Models/member.js");
const Auction = require("../../Models/auction.js");
const Ticket = require("../../Models/ticket.js");
const config = require("../../Resources/Structures/EconomyConfig.js");

  module.exports = {
    name: ["economy", "admin", "give"],
    description: "give some extra money to some user",
    category: "Economy",
    options: [
        {
            name: "user",
            description: "The user you want to give money to.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "amount",
            description: "The amount of money you want to give.",
            type: ApplicationCommandOptionType.Integer,
            required: true
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
    },
        /**
       * @param {CommandInteraction} interaction
       * @param {Client} client   
       */
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const args = interaction.options.getInteger("amount");
    
        const member = interaction.options.getUser("user");
        if (member.bot) return interaction.editReply("You can't give money to bots.");

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js

        const target = await Member.findOne({ guild_id: interaction.guild.id, user_id: member.id });
        /// + TARGET MONEY
        target.money += args;
        await target.save().then(() => {
            const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You give money \`$${numberWithCommas(args)}\` into ${member}.`)
            .setTimestamp();

            interaction.editReply({ embeds: [embed] });
        });
    
    },
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}