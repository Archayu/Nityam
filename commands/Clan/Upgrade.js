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
    name: ["clan", "buy", "upgrade"],
    description: "upgrade your clan to next level",
    category: "Clan",
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
    run: async (interaction, client) => {
      interaction.deferReply();
      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
      if (!clan) return interaction.editReply("You are not the clan owner");

      if (clan.clan_level === config.clan.max_lvl_upgrade) return interaction.editReply("Your clan is already at the max level");
      /// Need money to upgrade
      const formatUpgrade = config.clan.upgrade_start * Math.pow(config.clan.multiple_upgrade, clan.clan_level);
      if (clan.clan_money < formatUpgrade) return interaction.editReply(`You need at least \`$${numberWithCommas(formatUpgrade)}\` coins to upgrade your clan`);

      clan.clan_money -= formatUpgrade;
      clan.clan_level++;
      clan.member_limit += config.clan.increase_member;
      
      await clan.save().then(() => {
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan LevelUp")
              .setDescription(`\`${interaction.user.tag}\` *has upgraded clan to level* \`${clan.clan_level}\``)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

      return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  