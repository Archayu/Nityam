
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
const pendings = {}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    name: ["economy", "pay"],
    description: "pay money to someone",
    category: "Economy",
    options: [
        {
            name: "amount",
            description: "The amount you want to pay.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "user",
            description: "The user you want to pay.",
            type: ApplicationCommandOptionType.User,
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
        const args = interaction.options.getString("amount");

        const filters = [
            "+",
            "-"
        ];

        for (const message in filters) {
            if (args.includes(filters[message])) return interaction.editReply("You can't do that!");
        }

        if (args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");

        const member = interaction.options.getUser("user");
        if (member.id === interaction.user.id) return interaction.editReply("You can't pay yourself.");
        if (member.bot) return interaction.editReply("You can't pay bots.");

        /// Try to create new database went this member not have!
        await client.CreateAndUpdate(interaction.guild.id, member.id) /// Can find this module in Handlers/loadCreate.js

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
        const target = await Member.findOne({ guild_id: interaction.guild.id, user_id: member.id });

        if (args > user.money) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to pay this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (user.money < -1) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have are negative money!`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args.toLowerCase() == 'all') { /// PAY ALL
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You pay \`$${numberWithCommas(user.money)}\` to ${member}.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });
			
			target.money += user.money;
            user.money = 0;

            await target.save();
            await user.save();
        } else { /// PAY AMOUNT
            target.money += parseInt(args);
            user.money -= parseInt(args);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You pay \`$${numberWithCommas(args)}\` to ${member}.`)
                .setTimestamp();

			interaction.editReply({ embeds: [embed] });

            await target.save();
            await user.save();
        }
    },
  };
  