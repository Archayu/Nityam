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
    name: ["clan", "buy", "voice"],
    description: "buy voice for your clan",
    category: "Clan",
    options: [
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
      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
      if (!clan) return interaction.editReply("You are not the clan owner");

      const role = await Clan.findOne({ guild_id: interaction.guild.id, clan_role: { $in: interaction.member.roles.cache.map(r => r.id) } });
      if (!role) return interaction.editReply("You need to buy a clan role to use this command");

      const channel = interaction.guild.channels.cache.find(channel => channel.name === `${clan.clan_name}`);
      if (channel) return interaction.editReply(`You already have this clan voice ${channel}`);

      if (clan.clan_money < config.clan.voice_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.voice_cost)}\` coins to buy a clan voice`);
      if (clan.clan_level < config.clan.voice_level) return interaction.editReply(`You need to be level \`${config.clan.voice_level}\` to buy a clan voice`);

      clan.clan_money -= config.clan.voice_cost;
      await clan.save();

      await interaction.guild.channels.create({ 
          name: `${clan.clan_name}`,
          type: 2, 
          parent: interaction.channel.parentId,
          permissionOverwrites: [
              {
                  id: interaction.guild.roles.everyone,
                  deny: ['ViewChannel', 'Connect'],
              },
              {
                  id: clan.clan_owner,
                  allow: ['ViewChannel', 'Connect', 'Speak'],
              },
              {
                  id: clan.clan_role,
                  allow: ['ViewChannel', 'Connect', 'Speak'],
              }
          ]
      }).then(async (channel) => {
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan Voice")
              .setDescription(`\`${interaction.user.tag}\` *has bought a clan chat*`)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

          return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  