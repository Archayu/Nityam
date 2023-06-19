const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction,
    Client
  } = require("discord.js");
const Member = require("../../Models/member");
  module.exports = {
    name: ["economy", "marridge-divorce"],
    description: "give divorce to your partner",
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

        const your = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
        if (!your.married) return interaction.editReply("You are not married.");

        const target = await Member.findOne({ guild_id: interaction.guild.id, user_id: your.married_to });
        const fetch = await client.users.fetch(your.married_to);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: "Marry Divorce", iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`\`${interaction.user.tag}\` *has divorced* \`${client.users.cache.get(fetch.id).tag}\``)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setFooter({ text: `Divorced by: ${interaction.user.tag}` })
            .setTimestamp();

        await target.updateOne({ married: false, married_to: "" });
        await your.updateOne({ married: false, married_to: "" });
        await interaction.editReply({ embeds: [embed] });
    },
  };
  