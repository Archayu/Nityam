
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType, CommandInteraction, Client} = require("discord.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const { LeadPage } = require("../../Resources/Structures/Pagination")

module.exports = {
    name: ["economy", "money-leaderboard"],
    description: "see the leaderboard of the money in the guild",
    category: "Economy",
    options: [
      {
        name: "page",
        description: "The page you want to get information about.",
        type: ApplicationCommandOptionType.Integer, /// 4 = Integer
        required: false
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
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client   
     */
    
    run: async (interaction, client) => {
      interaction.deferReply();
                  const args = interaction.options.getInteger("page");
                   const user = await Member.find({ guild_id: interaction.guild.id });
        
            let pagesNum = Math.ceil(user.length / 10);
            if(pagesNum === 0) pagesNum = 1;

            /// Sort by Money
            user.sort((a, b) => {
                return b.money + b.bank - (a.money + a.bank);
            });

            const userStrings = [];
            for (let i = 0; i < user.length; i++) {
                const e = user[i];
                const fetch = await client.users.fetch(e.user_id);
                userStrings.push(
                    `**${i + 1}.** ${client.users.cache.get(fetch.id)} \`$${numberWithCommas(e.money + e.bank)} 💰 Coins\`
                    `);
            }

            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = userStrings.slice(i * 10, i * 10 + 10).join('');

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Top Money`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription(`${str == '' ? '  No Users' : '\n' + str}`)
                    .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${user.length} • Total Members`});

                pages.push(embed);
            }

            if (!args) {
                if (pages.length == pagesNum && user.length > 10) LeadPage(client, interaction, pages, 120000, user.length);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(args)) return interaction.editReply('Page must be a number.');
                if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
                const pageNum = args == 0 ? 1 : args - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
    },
  };
  