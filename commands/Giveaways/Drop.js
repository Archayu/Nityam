const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const messages = require("../../Resources/Structures/GiveawayMessages");
  module.exports = {
    name: ["giveaway", "drop"],
    description: "drop a prize to a channel",
    category: "Giveaways",
    options: [
        {
            name: 'winners',
            description: 'How many winners the giveaway should have',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'prize',
            description: 'What the prize of the giveaway should be',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'The channel to start the giveaway in',
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement]
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
      await interaction.deferReply();
            // If the member doesn't have enough permissions
            if(!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
                return interaction.editReply({
                    content: ':x: You need to have the manage messages permissions to start giveaways.',
                    ephemeral: true
                });
            }
    
            const giveawayChannel = interaction.options.getChannel('channel');
            const giveawayWinnerCount = interaction.options.getInteger('winners');
            const giveawayPrize = interaction.options.getString('prize');
          
        if (!giveawayChannel.isTextBased()) {
          return interaction.editReply({
            content: ':x: Please select a text channel!',
            ephemeral: true
          });
        }   
        if (giveawayWinnerCount < 1) {
          return interaction.editReply({
            content: ':x: Please select a valid winner count! greater or equal to one.',
          })
        }
    
            // Start the giveaway
            client.giveawaysManager.start(giveawayChannel, {
                // The number of winners for this drop
                winnerCount: giveawayWinnerCount,
                // The prize of the giveaway
                prize: giveawayPrize,
                // Who hosts this giveaway
                hostedBy: interaction.user,
                // specify drop
                isDrop: true,
                // Messages
                messages
            });
    
            interaction.editReply(`Giveaway started in ${giveawayChannel}!`);
    },
  };
  