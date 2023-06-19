const Clan = require("../../Models/clan");
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const { ClanPage } = require("../../Resources/Structures/Pagination.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
const humanizeDuration = require("humanize-duration");

module.exports = {
    name: ["clan", "buy", "role"],
    description: "buy a role for your clan",
    category: "Clan",
    options: [
        {
            name: "color",
            description: "The color of the role.",
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
      const args = interaction.options.getString("color");
      if(!args.startsWith("#")) return interaction.editReply("Please provide a valid hex color code.");

      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
      if (!clan) return interaction.editReply("You are not the clan owner");

      const role = interaction.guild.roles.cache.find(role => role.name === `${clan.clan_name}`);
      if (role) return interaction.editReply("You already have clan role");

      if (clan.clan_money < config.clan.role_cost) return interaction.editReply(`You need at least \`$${numberWithCommas(config.clan.role_cost)}\` coins to buy a clan role`);
      if (clan.clan_level < config.clan.role_level) return interaction.editReply(`You need to be level \`${config.clan.role_level}\` to buy a clan role`);

      clan.clan_money -= config.clan.role_cost;
      await clan.save();

      await interaction.guild.roles.create({
          name: `${clan.clan_name}`,
          color: args,
          permissions: ["ViewChannel"],
          mentionable: true,
      }).then(async (role) => {
          await clan.updateOne({ clan_role: role.id }).then( async () => {
              await clan.clan_members.forEach(async (member) => {
                  await interaction.guild.members.fetch(member).then(async (member) => {
                      await member.roles.add(role);
                  });
                  const embed = new EmbedBuilder()
                      .setColor(client.color)
                      .setTitle("Clan Role")
                      .setDescription(`\`${interaction.user.tag}\` *has bought a clan role*`)
                      .setThumbnail(clan.clan_icon)
                      .setFooter({ text: `Clan Tag: ${clan.clan_tag}`});

                  return interaction.editReply({ embeds: [embed] });
              });
          });
      });
    },
  };
  