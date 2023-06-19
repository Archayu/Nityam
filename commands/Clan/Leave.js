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
    name: ["clan", "leave"],
    description: "Leave Your Clan",
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
      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_members: interaction.user.id });
      if (!clan) return interaction.editReply("You are not in a clan");

      const owner = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
      if (owner) return interaction.editReply("You can't leave your clan while you are the owner");

      await clan.updateOne({ $pull: { clan_members: interaction.user.id } }).then(() => {
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan Leave")
              .setDescription(`\`${interaction.user.tag}\` *has left the clan*`)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

          return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  