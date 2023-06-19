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
    name: ["clan", "buy", "chat"],
    description: "Buy a clan chat for all clan member.",
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

      const role = await Clan.findOne({ guild_id: interaction.guild.id, clan_role: { $in: interaction.member.roles.cache.map(r => r.id) } });
      if (!role) return interaction.editReply("You need to buy a clan role to use this command");

      const channel = interaction.guild.channels.cache.find(channel => channel.name === `${clan.clan_tag}-chat`);
      if (channel) return interaction.editReply(`You already have this clan chat ${channel}`);

      if (clan.clan_money < config.clan.chat_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.chat_cost)}\` coins to buy a clan chat`);
      if (clan.clan_level < config.clan.chat_level) return interaction.editReply(`You need to be level \`${config.clan.chat_level}\` to buy a clan chat`);

      clan.clan_money -= config.clan.chat_cost;
      await clan.save();

      await interaction.guild.channels.create({
          name: `${clan.clan_tag}-chat`,
          type: 0, 
          topic: `Clan Chat for ${clan.clan_name}`,
          parent: interaction.channel.parentId,
          permissionOverwrites: [
              {
                  id: interaction.guild.roles.everyone,
                  deny: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
              },
              {
                  id: clan.clan_owner,
                  allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles', 'ManageMessages'],
              },
              {
                  id: clan.clan_role,
                  allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'],
              }
          ]
      }).then(async (channel) => {
          await channel.send(`Welcome to the clan chat ${interaction.member}`);
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Clan Chat")
              .setDescription(`\`${interaction.user.tag}\` *has bought a clan chat*`)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

          return interaction.editReply({ embeds: [embed] });
      });
    },
  };
  