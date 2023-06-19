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
    name: ["clan", "kick"],
    description: "kick a member from your clan",
    category: "Clan",
    options: [
        {
            name: "user",
            description: "The user to kick from your clan.",
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

      if (member.id === interaction.user.id) return interaction.editReply("You can't kick yourself");
      if (!clan.clan_members.includes(member.id)) return interaction.editReply("This member is not in your clan");
      if (clan.clan_members.length === 1) return interaction.editReply("You can't kick the last member from your clan");

      await clan.clan_members.splice(clan.clan_members.indexOf(member.id), 1);
      await clan.save().then(() => {
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan Kick")
              .setDescription(`\`${member.tag}\` *has been kicked from your clan*`)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

      return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  