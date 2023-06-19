
const Member = require("../../Models/member.js");
const { EmbedBuilder, MessageCollector, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
const pendings = {}
const Roulette = require("../../Models/roulette.js")
const { betSave, revMoney, getNumber, payoutWinners, sendMsg } = require("../../Resources/Structures/Roulette.js")
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    name: ["economy", "games", "roulette"],
    description: "play roulette",
    category: "Economy",
    options: [
        {
            name: "bet",
            description: "The amount of money you want to bet.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "space",
            description: "The space you want to bet on.",
            type: ApplicationCommandOptionType.String, /// 3 = String
            required: true,
        },
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

        
    },
  };
  async function runRoulette(interaction, space, args, client) {
    //// RUN ROULETTE!
    const db = await Roulette.findOne({ guild_id: interaction.guild.id });
    if (db.roulette) {
        // True
		
		const data = await Roulette.findOne({ guild_id: interaction.guild.id });

        if(data.time_limit < Date.now()) {
            return interaction.editReply(`You can't bet, you run out of time.`);
        }

        /// Save History bets
        await betSave(interaction.guild.id, space, args, interaction.user.id);

        /// Remove Money
        await revMoney(interaction.guild.id, interaction.user.id, args);

        const cooldown = new Date(data.time);
        const time = new Date(cooldown - new Date());
        const time_format = `${time.getUTCSeconds()} seconds`;

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You have place a bet of \`$${numberWithCommas(args)}\` on \`${space}\``)
            .setFooter({ text: `Time remaining: ${time_format}` });

        interaction.editReply({ embeds: [embed] });
    } else {
        // False
        
        /// Save History bets
        await betSave(interaction.guild.id, space, args, interaction.user.id);

        /// Remove Money
        await revMoney(interaction.guild.id, interaction.user.id, args);

        /// Run Random roulette
        await getNumber(interaction.guild.id);

        /// Update time!
        const data = await Roulette.findOne({ guild_id: interaction.guild.id });

        if (data.time == 0) {
            await Roulette.findOneAndUpdate({ guild_id: interaction.guild.id }, { time: Date.now() + (data.time_remaining * 1000), time_limit: Date.now() + (25 * 1000) });
        }

        await Roulette.findOneAndUpdate({ guild_id: interaction.guild.id }, { roulette: true });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(`You have place a bet of \`$${numberWithCommas(args)}\` on \`${space}\``)
            .setFooter({ text: `Time remaining: 30 seconds` });

        interaction.editReply({ embeds: [embed] });

        /// wait 30 seconds!
        await delay(30000);

        /// give money to winners
        await payoutWinners(interaction.guild.id);

        /// send msg winners
        await sendMsg(interaction, interaction.guild.id);

        /// Delete database
        await data.delete();
    }
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}