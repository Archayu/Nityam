const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const { Database } = require("st.db");

const BStats = new Database("./Models/Json/stats.json", { databaseInObject: true });
  module.exports = {
    name: ["usable-stats"],
    description: "Display all commands stats usable.",
    category: "General",
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
        await interaction.deferReply({ ephemeral: false });

        const all = BStats.all().slice(0, 10);

        all.sort((a, b) => {
            return b.data - a.data;
        });

        var index = 0;

        for (let i = 0; i < all.length; i++) {
            const total = all[i].data;
            index = (index + total)
        }

        const TopUsable = [];
        for (let i = 0; i < all.length; i++) {
            const name = all[i].ID;
            const usable = all[i].data;

            TopUsable.push(
                `**${i + 1}.** ${name} | **Used:** \`${usable}\` Time(s)
                `)
        }

        const str = TopUsable.join('');

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `Usable Commands!`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(`${str == '' ? '  No Usable' : '\n' + str}`)
            .setFooter({ text: `Total Command • ${BStats.all().length} | Total Time(s) Used • ${index}` })


        return interaction.editReply({ embeds: [embed] })
    },
  };
  