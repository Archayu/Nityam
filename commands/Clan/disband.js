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
    name: ["clan", "disband"],
    description: "disband your clan",
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

        await clan.delete().then(() => {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle("Clan Deleted")
                .setDescription(`\`${interaction.user.tag}\` *has deleted clan*`)
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

        return interaction.editReply({ embeds: [embed] });
        });
    },
  };
  