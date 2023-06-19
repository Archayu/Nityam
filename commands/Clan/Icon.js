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
    name: ["clan", "settings", "icon"],
    description: "change the icon of your clan",
    category: "Clan",
    options: [
        {
            name: "image",
            description: "The image you want to set as the clan icon.",
            type: ApplicationCommandOptionType.String, /// 3 = String
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
      let args = interaction.options.getString("image");

      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
      if (!clan) return interaction.editReply("You are not the clan owner");

      if (!args.startsWith("http")) return interaction.editReply("*Please provide a valid link*");
      let ends = [".png", ".gif", ".jpg", ".jpeg", ".webp"];
      if (!ends.some(e => args.endsWith(e))) return interaction.editReply(`*Please provide a valid image*, *\`End with ${ends.join(", ")}\`*`);

      clan.clan_icon = args;
      await clan.save().then(() => {
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan Icon")
              .setDescription(`\`${interaction.user.tag}\` has changed the icon of their clan`)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

      return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  