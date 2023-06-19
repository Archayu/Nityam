const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Clan = require("../../Models/clan.js");
const Member = require("../../Models/member.js");
const Auction = require("../../Models/auction.js");
const Ticket = require("../../Models/ticket.js");
const config = require("../../Resources/Structures/EconomyConfig.js");
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  module.exports = {
    name: ["economy", "profile"],
    description: "see your profile",
    category: "Economy",
    options: [
        {
            name: "user",
            description: "The user you want to check.",
            type: ApplicationCommandOptionType.User,
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
      await interaction.deferReply({ ephemeral: false });

      const member = interaction.options.getUser("user");

      const mention = member ? member.id : interaction.user.id;
      /// Can't check bots
      const bot = member ? member.bot : interaction.user.bot;
      if (bot) return interaction.editReply("You can't check bots profile")

      const avatarURL = member ? member.displayAvatarURL({ format: "png", size: 512 }) : interaction.user.displayAvatarURL({ format: "png", size: 512 });
      const userTag = member ? member.tag : interaction.user.tag;
      const userUsername = member ? member.username : interaction.user.username;

      ///// NOT FINISHED ADD MORE SOON!

      /// Try to create new database went this member not have!
      await client.CreateAndUpdate(interaction.guild.id, mention) /// Can find this module in Handlers/loadCreate.js

      const user = await Member.findOne({ guild_id: interaction.guild.id, user_id: mention });
      const clan = await Clan.findOne({ guild_id: interaction.guild.id, clan_members: mention });
      const auction = await Auction.findOne({ guild_id: interaction.guild.id, item_seller: mention }).countDocuments();

      const ticket = await Ticket.findOne({ guild_id: interaction.guild.id, user_id: mention });
      const TotalTickets = (ticket.common_ticket + ticket.uncommon_ticket) + (ticket.rare_ticket + ticket.epic_ticket) + (ticket.legendary_ticket + ticket.mythical_ticket);

      const randomtip = [
          "/social to setting social link!", 
          "/clan to view clan commands", 
          "/auction for auction", 
          "/work to get some money",
          "/gacha to get some tickets",
          "/roulette to play roulette",
          "/leaderboard to view your rank",
          "/profile to view profile",
          "/marry to marry someone",
      ];

      const tip = randomtip[Math.floor(Math.random() * randomtip.length)];

      if(user.married_to && !client.users.cache.get(user.married_to)){
          await client.users.fetch(user.married_to, true);
      }

      const Lover = !user.married_to ? "Not Married" : client.users.cache.get(user.married_to).tag;

      const embed = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: userTag, iconURL: avatarURL })
          .setThumbnail(avatarURL)
          .setDescription(`Use the \`/leaderboard\` command to view your rank.`)
          .addFields({ name: "Username:", value: `\`${userUsername}\``, inline: true})
          .addFields({ name: "Rank:", value: `\`${user.rank} 💠\``, inline: true})
          .addFields({ name: "Marry:", value: `\`💞 ${Lover}\``, inline: true})
          .addFields({ name: "Reputation:", value: `\`${user.reputation} 💎 Reputation\``, inline: true})
          .addFields({ name: "Clan:", value: `\`📄 ${clan ? clan.clan_name : "No Clan"} (Lvl.${clan ? clan.clan_level : "0"})\``, inline: true})
          .addFields({ name: "Money:", value: `\`$${numberWithCommas(user.money + user.bank)} 💰 Coins\``, inline: true})
          .addFields({ name: "Auction:", value: `\`${auction}/${config.auction.max_auction} 🛒 Items\``, inline: true})
          .addFields({ name: "Ticket:", value: `\`${TotalTickets} 🎫 Tickets\``, inline: true})
          .setFooter({ text: `Tip: ${tip}` })
          .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    },
  };
  