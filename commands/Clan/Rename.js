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
    name: ["clan", "buy", "rename"],
    description: "buy rename card and change the name",
    category: "Clan",
    options: [
        {
            name: "new",
            description: "The new name for your clan.",
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
      const clanName = interaction.options.getString("new");
      const clanTag = clanName.toLowerCase().replace(/ /g, '-');

      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
      if (!clan) return interaction.editReply("You are not the clan owner");

      if (clan.clan_name === clanName) return interaction.editReply("You already have that name");
      if (clan.clan_tag === clanTag) return interaction.editReply("You already have that name");
      if (clan.clan_money < config.clan.rename_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.rename_cost)}\` coins to rename your clan`);
      if (clan.clan_level < config.clan.rename_level) return interaction.editReply(`You need to be level \`${config.clan.rename_level}\` to rename your clan`);

      if (args.length > config.clan.rename_character) return interaction.editReply("Please provide a name under 50 characters");

      clan.clan_money -= config.clan.rename_cost;
      clan.clan_name = args;
      await clan.save().then(() => {
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan Rename")
              .setDescription(`${interaction.user} *has changed the name*`)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

          return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  