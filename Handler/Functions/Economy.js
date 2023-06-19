const Ticket = require("../../Models/ticket");
const Member = require("../../Models/member");
const DarkAuction = require("../../Models/darkauction");
const Roulette = require("../../Models/roulette");
const Coinflip = require("../../Models/coinflip");
const config = require("../../Resources/Structures/EconomyConfig");
const { Client, EmbedBuilder } = require("discord.js");
const delay = require("delay");

  
  /**
   *
   * @param {Client} client
   */
module.exports = async (client) => {

    client.CreateAndUpdate = async function (guild_id, mention_id) {
        const newuser = await Member.findOne({ guild_id: guild_id, user_id: mention_id });
        if (!newuser) {
            const newDatabase = await new Member({
                guild_id: guild_id,
                user_id: mention_id,
                work_cooldown: 0,
                work_cooldown_time: config.general.work_cooldown_time,
                work_multiple: config.general.work_multiple,
                money: config.general.start_money,
                bank: 0,
                rob: false,
                rob_cooldown: 0,
                rob_cooldown_time: config.general.rob_cooldown_time,
                crime_cooldown: 0,
                crime_cooldown_time: config.general.crime_cooldown_time,
                crime_multiple: config.general.crime_multiple,
                vote_cooldown: 0,
                vote_cooldown_time: config.general.vote_cooldown_time,
                married_to: "",
                married: false,
                rank: "Newbie",
                reputation: 0,
                facebook: "",
                instagram: "",
                twitter: "",
            });
            await newDatabase.save();
        }

        const ticket = await Ticket.findOne({ guild_id: guild_id, user_id: mention_id });
        if (!ticket) {
            const newTicket = await new Ticket({
                guild_id: guild_id,
                user_id: mention_id,
                gacha_cooldown: 0,
                gacha_cooldown_time: 2,
                three_star_ticket: 0,
                four_star_ticket: 0,
                five_star_ticket: 0,
                six_star_ticket: 0,
                guarantee_five_star: 0,
                guarantee_six_star: 0,
            });
            await newTicket.save();
        }
    };

    client.AuctionCreateAndUpdate = async function (guildId) {
        const auction = await DarkAuction.findOne({ guild_id: guildId });
        if (!auction) {
            const newAuction = await new DarkAuction({
                guild_id: guildId,
                enabled: false,
                channel_id: "",
                message_id: "",
                item: "",
                price: 0,
                old_price: 0,
                bidder: "",
                ended: true,
                history: [],
            });
            await newAuction.save();
        }
    }

    client.Roulette = async function (guildId) {
        const roulette = await Roulette.findOne({ guild_id: guildId });
        if (!roulette) {
            const newRoulette = await new Roulette({
                guild_id: guildId,
                roulette: false,
                history: [],
                space: [],
                data: [],
                time_remaining: 30,
                time: 0,
                time_limit: 0,
            });
            await newRoulette.save();
        }
    }

    client.Coinflip = async function (guildId) {
        const coinflip = await Coinflip.findOne({ guild_id: guildId });
        if (!coinflip) {
            const newCoinflip = await new Coinflip({
                guild_id: guildId,
                coinflip: false,
                history: [],
                space: "",
                data: [],
                time_remaining: 30,
                time: 0,
                time_limit: 0,
            });
            await newCoinflip.save();
        }
    }

    client.UpdateBidder = async function (guildId, userId) {
        let database = await DarkAuction.findOne({ guild_id: guildId });
        if (database.enabled === false) return;

        //// Check channel and return if not same
        let channel = await client.channels.cache.get(database.channel_id);
        if (!channel) return;

        //// Check message bot and return if not same
        let BidderUpdate = await channel.messages.fetch(database.message_id, { cache: false, force: true });
        if (!BidderUpdate) return;

        /// Fetch role
        let role = await client.guilds.cache.get(guildId).roles.cache.find(r => r.name === database.item);
        if (!role) return;

        let embed = new EmbedBuilder()
            .setAuthor({ name: `DARK AUCTION`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
            .setDescription(`
            **Role:** ${role.name}
            **Bidder:** ${client.users.cache.get(userId)}
            **Highest Bid:** $${numberWithCommas(database.price)} Coins

            **Place Bid:** $${numberWithCommas(database.price * config.dark_auction.multiple)} Coins
            `)
            .setThumbnail(client.users.cache.get(userId).avatarURL({ format: "png", dynamic: true, size: 512 }))
            .setColor(client.color)
            .setFooter({ text: `Time remaining: 120 seconds`});

        await BidderUpdate.edit({ embeds: [embed] });
    };

    //// Time remaining & and delete channel
    client.DeleteChannel = async function (guildId) {
        let database = await DarkAuction.findOne({ guild_id: guildId });
        if (database.enabled === false) return;

        //// Check channel and return if not same
        let channel = await client.channels.cache.get(database.channel_id);
        if (!channel) return;

        //// Check message bot and return if not same
        let AuctionEnd = await channel.messages.fetch(database.message_id, { cache: false, force: true });
        if (!AuctionEnd) return;

        await DarkAuction.findOneAndUpdate({ guild_id: guildId }, {
            ended: false,
        });

        //// Delay delete channel
        await delay(config.dark_auction.time_remaining);

        /// Find database again
        let newdata = await DarkAuction.findOne({ guild_id: guildId });

        /// Update channel to deny message @everyone
        await channel.edit({
                permissionOverwrites: [
                    {
                        id: channel.guild.roles.everyone,
                        allow: ['ViewChannel', 'ReadMessageHistory'],
                        deny: ['SendMessages'],
                    }
                ]
            });

        /// Find History
        const G = await DarkAuction.findOne({ guild_id: guildId });

        /// Get history and give money back all
        const history = G.history;
        for (let i = 0; i < history.length; i++) {
            const member = await Member.findOne({ guild_id: guildId, user_id: history[i].bidder });
            member.money += history[i].price;
            member.save();
        }

        /// Fetch User
        let member = await client.guilds.cache.get(guildId).members.fetch(newdata.bidder);
        if (!member) return;

        /// Fetch Role
        let role = await client.guilds.cache.get(guildId).roles.cache.find(r => r.name === newdata.item);
        if (!role) return;

        /// Give Role to winner
        await member.roles.add(role);

        let embed = new EmbedBuilder()
            .setAuthor({ name: `DARK AUCTION`, iconURL: client.user.avatarURL({ format: "png", dynamic: true, size: 512 }) })
            .setDescription(`
            **Role:** ${role.name}
            **Bidder:** ${client.users.cache.get(newdata.bidder)}
            **Price:** $${numberWithCommas(newdata.price)} Coins

            **Normal Price:** $${numberWithCommas(database.old_price * config.dark_auction.multiple)} Coins
            `)
            .setThumbnail(client.users.cache.get(newdata.bidder).avatarURL({ format: "png", dynamic: true, size: 512 }))
            .setColor("Orange")
            .setFooter({ text: `Winner is ${client.users.cache.get(newdata.bidder).tag}`});

        /// Find Winner
        const user = await Member.findOne({ guild_id: guildId, user_id: newdata.bidder });

        //// Remove Money from winner
        await Member.findOneAndUpdate({ guild_id: guildId, user_id: newdata.bidder }, {
            money: user.money - newdata.price,
        });

        /// Delete database
        await DarkAuction.findOneAndDelete({ guild_id: guildId });

        /// Edit Message bot
        await AuctionEnd.edit({ embeds: [embed] });
        /// Send message to channel
        await channel.send(`\`DARK AUCTION ENDED! WILL CLOSE IN 60 SECONDS\``);

        /// Delay delete channel!
        await delay(60000);
        await channel.delete();
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}