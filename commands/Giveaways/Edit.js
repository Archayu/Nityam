const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const messages = require("../../Resources/Structures/GiveawayMessages");
  const ms = require("ms")
  module.exports = {
    name: ["giveaway", "edit"],
    description: "Eit The Giveaway In The Guild",
    category: "Giveaways",
    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to end (message ID)',
            type: ApplicationCommandOptionType.String,
            required: true
          },
          {
            name: 'duration',
            description: 'Setting time of mentioned giveaway. Eg. 1h sets the current giveaway to end after an hour!',
            type: ApplicationCommandOptionType.String,
            required: true
          },
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

        
        const gid = interaction.options.getString('giveaway');
        const time = interaction.options.getString('duration');
        const winnersCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        let duration;
        if (time.startsWith("-")) {
          duration = -ms(time.substring(1));
        } else {
          duration = ms(time);
        }
    
        if (isNaN(duration)) {
          return interaction.reply({
            content: ":x: Please select a valid duration!",
            ephemeral: true,
          });
        }
        await interaction.deferReply({
          ephemeral: true
        })
        // Edit the giveaway
        try {
          await client.giveawaysManager.edit(gid, {
            newWinnerCount: winnersCount,
            newPrize: prize,
            addTime: time
          })
        } catch (e) {
          return interaction.editReply({
            content:
              `No giveaway found with the given message ID: \`${gid}\``,
            ephemeral: true
          });
        }
        interaction.editReply({
          content:
            `This giveaway has now been edited!`,
          ephemeral: true
        });

    },
  };
  