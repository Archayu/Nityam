const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["giveaway", "delete"],
    description: "Delete a giveaway",
    category: "Giveaway",
    options: [
        {
            name: "message-id",
            description: "The message id of the giveaway message",
            required: true,
            type: ApplicationCommandOptionType.String 
        }
    ],
    permissions: {
        channel: [],
        bot: ["ManageMessages"],
        user: ["ManageGuild", "ManageChannels"]
    },
    settings: {
        isPremium: false,
        isOwner: false,
        inVoice: false,
        isNSFW: false,
    },
    run: async (interaction, client, user, language) => {

        await interaction.deferReply({ ephemeral: true});

        const messageId = interaction.options.getString('message-id');

        const deleted = client.giveaways.deleteGiveaway(messageId);
        interaction.editReply({ content: `${deleted ? 'Deleted' : 'Not deleted'}`})




    }

}