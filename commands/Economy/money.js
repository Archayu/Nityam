
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
const pendings = {}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    name: ["economy", "money"],
    description: "check your or other user money",
    category: "Economy",
    options: [
        {
            name: "user",
            description: "The user you want to check.",
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
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
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const member = interaction.options.getUser("user")
        const mention = member ? member.id : interaction.user.id;

        const bot = member ? member.bot : interaction.user.bot;
        if (bot) return interaction.editReply("You can't check bots money");

        const avatarURL = member ? member.displayAvatarURL({ format: "png", size: 512 }) : interaction.user.displayAvatarURL({ format: "png", size: 512 });
        const userTag = member ? member.tag : interaction.user.tag;

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, mention);

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: mention });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: userTag, iconURL: avatarURL })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`Use the \`/leaderboard\` command to view your rank.`)
            .addFields({ name: "Coin:", value: `\`$${numberWithCommas(user.money)}\``, inline: true })
            .addFields({ name: "Bank:", value: `\`$${numberWithCommas(user.bank)}\``, inline: true })
            .addFields({ name: "Total:", value: `\`$${numberWithCommas(user.money + user.bank)}\``, inline: true })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },
  };
  