const Clan = require("../../Models/clan");
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const { ClanPage } = require("../../Resources/Structures/Pagination.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
const humanizeDuration = require("humanize-duration");
const pendings = {}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = {
    name: ["clan", "info"],
    description: "Get Info About Clan",
    category: "Clan",
    options: [
        {
            name: "tag",
            description: "The tag clan you want to get information about.",
            type: ApplicationCommandOptionType.String,
            required: true,
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
      interaction.deferReply();
      const clanName = interaction.options.getString("tag");

      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_tag: clanName });
      if (!clan) return interaction.editReply("Clan not found");

      const embed = new EmbedBuilder()
          .setAuthor({ name: `Clan of ${clan.clan_name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setColor(client.color)
          .setDescription(`Use the \`/clan leaderboard\` command to view your clan rank.`)
          .addFields({ name: "Name:", value: `\`${clan.clan_name}\``, inline: true })
          .addFields({ name: "Owner:", value: `\`${client.users.cache.get(clan.clan_owner).username}\``, inline: true })
          .addFields({ name: "Level:", value: `\`${clan.clan_level}\``, inline: true })
          .addFields({ name: "Money:", value: `\`$${numberWithCommas(clan.clan_money)}\``, inline: true })
          .addFields({ name: "Created:", value: `\`${humanizeDuration(Date.now() - clan.clan_created, { largest: 1 })} ago\``, inline: true })
          .addFields({ name: "Alliance:", value: `\`${clan.clan_alliance.length}/5\``, inline: true})
          .addFields({ name: "Members:",  value: `\`${clan.clan_members.length}/${clan.member_limit}\``, inline: true })
          .setThumbnail(clan.clan_icon)
          .setTimestamp()
          .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

      return interaction.editReply({ embeds: [embed] });
        
    },
  };
  