const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["giveaway", "delete-all"],
    description: "Delete all the giveaways in the guild.",
    category: "",
    options: [],
    permissions: {
        channel: [],
        bot: [],
        user: ["ManageGuild"]
    },
    settings: {
        isPremium: false,
        isOwner: false,
        inVoice: false,
        isNSFW: false,
    },
    run: async (interaction, client, user, language) => {

        await interaction.deferReply({ ephemeral: true });

        const data = client.giveaways.deleteall(interaction.guildId);

        interaction.editReply({ content: `${data?.deleted} Giveaways Deleted`})

    }

}