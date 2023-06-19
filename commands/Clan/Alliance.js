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
    name: ["clan", "alliance"],
    description: "Add Remove Alliance From Your Clan",
    category: "Clan",
    options: [
        {
            name: "type",
            description: "Add or remove a clan to your alliance.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Add",
                    value: "add"
                },
                {
                    name: "Remove",
                    value: "remove"
                }
            ]
        },
        {
            name: "tag",
            description: "The tag clan you want to add/remove to your alliance.",
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
        interaction.deferReply();
        let clanName = interaction.options.getString("tag");

        const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_tag: clanName });
        if (!clan) return interaction.editReply("Clan not found");

        let currentClan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });

        if(interaction.options._hoistedOptions.find(c => c.value === "add")) {
            if (clan.clan_owner === interaction.user.id) return interaction.editReply("You cannot add your own clan to your alliance");

            if (currentClan.clan_alliance.length >= config.clan.max_alliance) return interaction.editReply("Your alliance is full");
            if (currentClan.clan_alliance.includes(clan.clan_tag)) return interaction.editReply("This clan is already in your alliance");

            await currentClan.clan_alliance.push(clan.clan_name);
            await currentClan.save().then(() => {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Clan Alliance")
                    .setDescription(`\`${clan.clan_name}\` *has been added to your alliance*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

            return interaction.editReply({ embeds: [embed] });
            });
        }

        if(interaction.options._hoistedOptions.find(c => c.value === "remove")) {
            if (clan.clan_owner === interaction.user.id) return interaction.editReply("You cannot remove your own clan to your alliance");

            if (!currentClan.clan_alliance.includes(clan.clan_name)) return interaction.editReply("This clan is not in your alliance");
    
            await currentClan.clan_alliance.splice(currentClan.clan_alliance.indexOf(clan.clan_name), 1);
            await currentClan.save().then(() => {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Clan Alliance")
                    .setDescription(`\`${clan.clan_name}\` *has been removed from your alliance*`)
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});
    
            return interaction.editReply({ embeds: [embed] });
            });
        }
    },
  };
  