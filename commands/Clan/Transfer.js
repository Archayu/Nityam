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
    name: ["clan", "transfer"],
    description: "Transfer Ownership To Other",
    category: "Clan",
    options: [
        {
            name: "user",
            description: "The user to transfer ownership to.",
            type: ApplicationCommandOptionType.User, /// 6 = User
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
      const member = interaction.options.getUser("user");

      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
      if (!clan) return interaction.editReply("You are not the clan owner");

      if (member.id === interaction.user.id) return interaction.editReply("You can't transfer your clan to yourself");
      if (member.bot) return interaction.editReply("You can't transfer your clan to a bot");

      // It not array can't pull or push
      clan.clan_owner = member.id;

      await clan.save().then(() => {
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan Transfer")
              .setDescription(`\`${interaction.user.tag}\` *has transferred owner clan to* \`${member.tag}\``)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

      return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  