const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction,
    Client
  } = require("discord.js");
const Member = require("../../Models/member");
const Ticket = require("../../Models/ticket");
const config = require("../../Resources/Structures/EconomyConfig");
  module.exports = {
    name: ["economy", "gacha", "10x"],
    description: "open gacha 10x",
    category: "Economy",
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
        /**
       * @param {CommandInteraction} interaction
       * @param {Client} client   
       */
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });

        const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
        const ticket = await Ticket.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });

        const cooldown = new Date(ticket.gacha_cooldown);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCHours()} hours, ${time.getUTCMinutes()} minutes and ${time.getUTCSeconds()} seconds`;

        if(ticket.gacha_cooldown > Date.now()) {
            return interaction.editReply(`You can't gacha yet, you have to wait \`${time_format}\``);
        }

        const six_stars = config.gacha.six_stars;
        const five_stars = config.gacha.five_stars;
        const four_stars = config.gacha.four_stars;
        const three_stars = config.gacha.three_stars;
        if (user.money < config.gacha.gacha_price_ten_round) return interaction.editReply(`You need ${numberWithCommas(config.gacha.gacha_price_ten_round)} coins to open gacha x10.`);
        const store = [];

        if (ticket.guarantee_five_star >= config.gacha.guarantee_five_star) {
            const random = Math.floor(Math.random() * config.gacha.five_stars.length);
            store.push(
                `\`🌟\` **Guarantee.** \`${five_stars[random]}\` \`⭐ ⭐ ⭐ ⭐ ⭐\`
                `);

            ticket.guarantee_six_star += 1;
            ticket.guarantee_five_star = 0;
            ticket.five_star_ticket += 1;
        } else if (ticket.guarantee_six_star >= config.gacha.guarantee_six_star)  {
            const random = Math.floor(Math.random() * config.gacha.six_stars.length);
            store.push(
                `\`🌟\` **Guarantee.** \`${six_stars[random]}\` \`⭐ ⭐ ⭐ ⭐ ⭐ ⭐\`
                `);

            ticket.guarantee_six_star = 0;
            ticket.guarantee_five_star += 1;
            ticket.six_star_ticket += 1;
        }

        for (let i = 0; i < 10; i++) {
        const getNumber = roll()
        switch(getNumber[0]) {
            case 6:
                store.push(
                    `**${i + 1}.** \`${six_stars[getNumber[1]]}\` \`⭐ ⭐ ⭐ ⭐ ⭐ ⭐\`
                    `);
                // Got 6 Stars = reset guarantee
                ticket.guarantee_six_star = 0;
                // Add +1 guarantee five star
                ticket.guarantee_five_star += 1;
                // Add Ticket 6 Star
                ticket.six_star_ticket += 1;
                break;
            case 5:
                store.push(
                    `**${i + 1}.** \`${five_stars[getNumber[1]]}\` \`⭐ ⭐ ⭐ ⭐ ⭐\`
                    `);
                // Add +1 guarantee six star
                ticket.guarantee_six_star += 1;
                // Got 5 Star = reset guarantee
                ticket.guarantee_five_star = 0;
                // Add Ticket 5 Star
                ticket.five_star_ticket += 1;
                break;
            case 4:
                store.push(
                    `**${i + 1}.** \`${four_stars[getNumber[1]]}\` \`⭐ ⭐ ⭐ ⭐\`
                    `);
                // Add +1 guarantee six star
                ticket.guarantee_six_star += 1;
                // Add +1 guarantee five star
                ticket.guarantee_five_star += 1;
                // Add Ticket 4 Star
                ticket.four_star_ticket += 1;
                break;
            case 3:
                store.push(
                    `**${i + 1}.** \`${three_stars[getNumber[1]]}\` \`⭐ ⭐ ⭐\`
                    `);
                // Add +1 guarantee six star
                ticket.guarantee_six_star += 1;
                // Add +1 guarantee five star
                ticket.guarantee_five_star += 1;
                // Add Ticket 4 Star
                ticket.three_star_ticket += 1;
                break;
            }
        }

        const pages = [];
        for (let i = 0; i < 1; i++) {
        const str = store.slice(i * 12, i * 12 + 12).join("");

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: "Result Open x10", iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(str == "" ? " Nothing" : "\n" + str)
            .setFooter({ text: `• Guarantee 5 Star ${config.gacha.guarantee_five_star - ticket.guarantee_five_star} | 6 Star ${config.gacha.guarantee_six_star - ticket.guarantee_six_star}` });

            pages.push(embed);
        }

        interaction.editReply({ embeds: [pages[0]] });

        ticket.gacha_cooldown = Date.now() + (ticket.gacha_cooldown_time * 1000);
        user.money -= config.gacha.gacha_price_ten_round;

        await ticket.save();
        await user.save();

    },
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function roll() {
    const number = (Math.floor(Math.random() * 1000) + 1) * 0.1
    if (number <= 0.5) {
    const random = Math.floor(Math.random() * config.gacha.six_stars.length)
        return [6, random]
    } else if(number <= 1) {
        const random = Math.floor(Math.random() * config.gacha.five_stars.length)
        return [5, random]
    } else if(number <= 20) {
        const random = Math.floor(Math.random() * config.gacha.four_stars.length)
        return [4, random]
    } else if(number <= 60) {
        const random = Math.floor(Math.random() * config.gacha.three_stars.length)
        return [3, random]
    } else if(number <= 100) {
        const random = Math.floor(Math.random() * config.gacha.three_stars.length)
        return [3, random]
    }
}