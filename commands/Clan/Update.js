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
    name: ["clan", "buy", "update"],
    description: "update clan for all members",
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

      if (clan.clan_money < config.clan.update_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.update_cost)}\` coins to rename your clan`);
      if (clan.clan_level < config.clan.update_level) return interaction.editReply(`You need to be level \`${config.clan.update_level}\` to rename your clan`);

      clan.clan_money -= config.clan.update_cost;
      await clan.save();

      await clan.clan_members.forEach(async (member) => {
          await interaction.guild.members.fetch(member).then(async (member) => {
              await member.roles.add(clan.clan_role);
          });
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan Update")
              .setDescription(`\`${interaction.user.tag}\` *has update the clan.*`)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

          return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  