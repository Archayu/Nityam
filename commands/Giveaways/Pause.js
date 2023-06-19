const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const messages = require("../../Resources/Structures/GiveawayMessages");
  module.exports = {
    name: ["giveaway", "pause"],
    description: "pause the giveaway in the guild",
    category: "Giveaways",
    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to pause (message ID or giveaway prize)',
            type: ApplicationCommandOptionType.String,
            required: true
        
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

        const query = interaction.options.getString('giveaway');

        // try to find the giveaway with prize alternatively with ID
        const giveaway =
            // Search with giveaway prize
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway ID
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found
        if (!giveaway) {
            return interaction.reply({
                content: 'Unable to find a giveaway for `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: `**[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  is already paused.`,
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.pause(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply(`**[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** has now been paused!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    },
  };
  