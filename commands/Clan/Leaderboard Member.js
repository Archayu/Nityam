const Clan = require("../../Models/clan");
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const { ClanPage } = require("../../Resources/Structures/Pagination.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
const humanizeDuration = require("humanize-duration");
const pendings = {};
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    name: ["clan", "leaderboard-member"],
    description: "View the top member count clans in guild.",
    category: "Clan",
    options: [
      {
        name: "page",
        description: "The page you want to get information about.",
        type: ApplicationCommandOptionType.Integer, /// 4 = Integer
        required: false
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
      const args = interaction.options.getInteger("page");

      const clan = await Clan.find({ guild_id: interaction.guild.id });

      let pagesNum = Math.ceil(clan.length / 10);
      if(pagesNum === 0) pagesNum = 1;

      /// Sort by Members Counts

      clan.sort((a, b) => {
          return b.clan_members.length - a.clan_members.length;
      });

      const clanStrings = [];
      for (let i = 0; i < clan.length; i++) {
          const e = clan[i];
          clanStrings.push(
              `**${i + 1}. ${e.clan_name}** \`(Member ${e.clan_members.length})\` • ${client.users.cache.get(e.clan_owner).tag}
              `);
      }

      const pages = [];
      for (let i = 0; i < pagesNum; i++) {
          const str = clanStrings.slice(i * 10, i * 10 + 10).join('');

          const embed = new EmbedBuilder()
              .setAuthor({ name: `Top Member of Clans`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
              .setColor(client.color)
              .setDescription(`${str == '' ? '  No Clans' : '\n' + str}`)
              .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${clan.length} • Total Clans`});

          pages.push(embed);
      }

      if (!args) {
          if (pages.length == pagesNum && clan.length > 10) ClanPage(client, interaction, pages, 30000, clan.length);
          else return interaction.editReply({ embeds: [pages[0]] });
      }
      else {
          if (isNaN(args)) return interaction.editReply('Page must be a number.');
          if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
          const pageNum = args == 0 ? 1 : args - 1;
          return interaction.editReply({ embeds: [pages[pageNum]] });
      }
    },
  };
  