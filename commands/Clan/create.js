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
    name: ["clan", "create"],
    description: "Create Your Own Clan",
    category: "Clan",
    options: [
        {
            name: "name",
            description: "The name of the clan.",
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
        await interaction.deferReply({ ephemeral: false });
        const clanName = interaction.options.getString("name");
        const clanTag = clanName.toLowerCase().replace(/ /g, '-');
        const clanIcon = "https://media.discordapp.net/attachments/925675983699312663/930652439445651487/download.png";

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
        if (clan) return interaction.editReply("You already have a clan");

        const inClan = await Clan.findOne({ guild_id: interaction.guild.id, clan_members: interaction.user.id });
        if (inClan) return interaction.editReply("You are already in a clan");

        const aClanN = await Clan.findOne({ guild_id: interaction.guild.id, clan_name: clanName });
        if (aClanN) return interaction.editReply("That clan name is already taken");

        const aClanT = await Clan.findOne({ guild_id: interaction.guild.id, clan_tag: clanTag });
        if (aClanT) return interaction.editReply("That clan name is already taken");

        if (clanName.length > config.clan.clan_character) return interaction.editReply(`Please provide a clan name lower than \`${config.clan.clan_character}\` characters`);

        if (user.money < config.clan.create_clan) return interaction.editReply(`You need \`$${numberWithCommas(config.clan.create_clan)}\` coins to create a clan `);

        user.money -= config.clan.create_clan;
        await user.save();

        const newClan = new Clan({
            guild_id: interaction.guild.id,
            clan_name: clanName,
            clan_tag: clanTag,
            clan_icon: "https://media.discordapp.net/attachments/925675983699312663/930652439445651487/download.png",
            clan_banner: "https://media.discordapp.net/attachments/925675983699312663/930652439445651487/download.png",
            clan_owner: interaction.user.id,
            clan_created: Date.now(),
            clan_members: [interaction.user.id],
            clan_description: "No Description",
            clan_alliance: [],
            clan_role: "",
            clan_money: 0,
            clan_level: 1,
            member_limit: config.clan.max_member,
        });

        await newClan.save().then(() => {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle("Clan Created")
                .setDescription(`Clan \`[${clanName}]\` has been created`)
                .setThumbnail(clanIcon)
                .setFooter({ text: `Clan Tag: ${clanTag}` });

            return interaction.editReply({ embeds: [embed] });
        });
    },
  };
  