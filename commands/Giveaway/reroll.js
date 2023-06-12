const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["giveaway", "reroll"],
    description: "reroll the giveaway in the guild",
    category: "Guild",
    options: [
        {
            name: "message-id",
            description: "The message id of the giveaway message",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: ["ManageGuild", "ManageChannels"]
    },
    settings: {
        isPremium: false,
        isOwner: false,
        inVoice: false,
        isNSFW: false,
    },
    run: async (interaction, client, user, language) => {

      await  interaction.deferReply({ ephemeral: true });

        let messageId = interaction.options.getString("message-id", true);

        let rerolled = await client.giveaways.rerollGiveaway(messageId);

        if (rerolled) {
            interaction.editReply({ content: `Giveaway Rerolled!`})
        } else {
            interaction.editReply({ content: `Invalid Giveaway message id`})
        }

        


    }

}