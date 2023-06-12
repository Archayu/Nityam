const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const { Database } = require("st.db");
const ytsr = require("@distube/ytsr");

const SStats = new Database("./Models/Json/chart.json", { databaseInObject: true });
  module.exports = {
    name: ["topchart"],
    description: "Display top song most recent playable.",
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

        const all = SStats.all().slice(0, 10);

        all.sort((a, b) => {
            return b.data - a.data;
        });

        var index = 0;

        for (let i = 0; i < all.length; i++) {
            const total = all[i].data;
            index = (index + total)
        }

        const TopChart = [];
        for (let i = 0; i < all.length; i++) {
            const format = `https://youtu.be/${all[i].ID}`;
            const search = await ytsr(format, { limit: 1 });
            const track = search.items[0]; 

            TopChart.push(
                `**${i + 1}.** [${track.name}](${track.url}) | **Played:** \`${all[i].data}\` Time(s)
                `)
        }

        const str = TopChart.join('');

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `Top Charts`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(`${str == '' ? '  Nothing Played' : '\n' + str}`)
            .setFooter({ text: `Total Song • ${SStats.all().length} | Total Time(s) Played • ${index}` })


        return interaction.editReply({ embeds: [embed] })
    },
  };
  