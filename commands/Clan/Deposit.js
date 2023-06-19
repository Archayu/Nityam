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
    name: ["clan", "deposit"],
    description: "Deposite Your Money Into Your Clan",
    category: "Clan",
    options: [
        {
                    name: "amount",
                    description: "The amount you want to deposit.",
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
      const args = interaction.options.getString("amount");

      const filters = [
          "+",
          "-"
      ];

      for (const message in filters) {
          if (args.includes(filters[message])) return interaction.editReply("You can't do that!");
      }

      if(args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");
      
      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_owner: interaction.user.id });
      if (!clan) return interaction.editReply("You are not the clan owner");

      const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
      
      if (args > user.money) {
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
              .setDescription(`You don't have enough money to deposit this amount.`)
              .setTimestamp();

          return interaction.editReply({ embeds: [embed] });
      }

      if (args.toLowerCase() == 'all') { /// DEPOSIT ALL
          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
              .setDescription(`You have deposited \`$${numberWithCommas(user.money)}\` into your clan bank.`)
              .setTimestamp();

          interaction.editReply({ embeds: [embed] });

          clan.clan_money += user.money;
          user.money = 0;

          await user.save();
          await clan.save();
      } else { /// DEPOSIT AMOUNT
          clan.clan_money += parseInt(args);
          user.money -= parseInt(args);

          const embed = new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
              .setDescription(`You have deposited \`$${numberWithCommas(args)}\` into your clan bank.`)
              .setTimestamp();

          interaction.editReply({ embeds: [embed] });

          await user.save();
          await clan.save();
      }
    },
  };
  