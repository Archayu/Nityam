
const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    Colors
  } = require("discord.js");
  const sugSchema = require("../../Models/Suggetion");
  const sugSchema2 = require("../../Models/Suggetion2");
  const lvlSchema = require('../../Models/Leveling');
  const lvlSchema2 = require('../../Models/User_Exp');
  const messagesSchema = require("../../Models/Messages");
  const messageRewards = require("../../Models/MessageReward");
  const { Client } = require("discord.js");
const DarkAuction = require("../../Models/darkauction.js");
const Member = require("../../Models/member");
const config = require("../../Resources/Structures/EconomyConfig");
/**
 * @param {Client} client
 */
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild || !message.guild.available) return;

//Ecomomy User Register
await client.CreateAndUpdate(message.guild.id, message.author.id) /// Can find this module in Handlers/loadCreate.js
await client.AuctionCreateAndUpdate(message.guild.id)
await client.Roulette(message.guild.id)
await client.Coinflip(message.guild.id)
    //Suggetion System
   
    const data =
      (await sugSchema2.findOne({ id: message.guild.id })) ||
      (await sugSchema2.create({ id: message.guild.id }));
      if (message.channel.id === data.suggestion){
    
        let args = message.content;

    const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
  
          .setEmoji("⬆")
          .setCustomId("sug-up")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setEmoji("⬇")
          .setCustomId("sug-down")
          .setStyle(ButtonStyle.Secondary),
      ]);
  
      const row2 = new ActionRowBuilder().addComponents([
        new StringSelectMenuBuilder()
        .setPlaceholder("⍣ Actions")
        .setCustomId("suggestion").addOptions(
          new StringSelectMenuOptionBuilder()
          .setLabel("Update")
          .setValue("sug-update")
          .setDescription("Update Your suggestion"),
          
          new StringSelectMenuOptionBuilder()
          .setLabel("Create Thread")
          .setValue("sug-create-thread")
          .setDescription("Create a new thread to this suggestion"),
  
          new StringSelectMenuOptionBuilder()
          .setLabel("Accept")
          .setValue("sug-accept")
          .setDescription("Accept this suggestion"),
  
          new StringSelectMenuOptionBuilder()
          .setLabel("Decline")
          .setValue("sug-decline")
          .setDescription("Decline this suggestion")
      )
  
  
      ]);
  
  
      const msg = await message.channel.send({
        components: [row, row2],
        embeds: [{
            color: Colors.Blue,
            title: "New Suggestion!",
            description: `${args}`,
            fields: [{
                name: "Up Votes",
                value: "0",
                inline: true
            }, {
                name: "Down Votes",
                value: "0",
                inline: true
            }, {
                name: "Status",
                value: "pending",
                inline: true
            }],
            footer: {
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            }
        }]
    });

    await sugSchema.create({
        suggestion: args,
        user: message.author.id,
        message: msg.id,
        channel: message.channel.id,
        guild: message.guildId,
        votes: {
            up: [], down: []
        },
        createdAt: Date.now(),
    });
  
    msg.embeds[0].fields.push({
        name: "Suggestion ID",
        value: `\`\`\`\n${msg.id}\n\`\`\``,
        inline: true
    });
  
    msg.edit({
        embeds: msg.embeds
    });


    message.delete();
}
  //Leveling System
const lvldata = await lvlSchema.findOne({ id: message.guild.id }) || {};

if(lvldata.xp) {
    if(lvldata?.ignoreXP?.includes(message.channel.id) ) return;

    const userData = await lvlSchema2.findOne({ user: message.author.id, guild: message.guild.id }) || lvlSchema2.create({user: message.author.id, guild: message.guild.id })

    if (userData.lastXP + (lvldata.xpTimeout || 1000) > Date.now()) return;
    let xp = Math.floor(((Math.random() * (lvldata.xpLimit.up - lvldata.xpLimit.down)) + lvldata.xpLimit.down) * lvldata.xpRate),
        reqXP = 100;

    userData.xp += xp;

    for (let i = 1; i <= userData.level; i++)reqXP += 5 * (i ^ 2) + (50 * i) + 100;

    if (userData.xp >= reqXP) {
        userData.level += 1;
        lvldata.levelReward = lvldata.levelReward || {};

        const r = lvldata.levelReward[userData.level], role = message.guild.roles.cache.get(r),
            channel = message.guild.channels.cache.get(lvldata.xpLevelUp.channel) || message.channel;

        if (r !==undefined) {
            message.member.roles.add(role, `Level reward for reaching ${userData.level} level`).then(() => {
                reply(lvldata.levelRewardMessage.success, channel, message, userData, lvldata, role)
            }).catch(() => {
                reply(lvldata.levelRewardMessage.fail, channel, message, userData, lvldata, role);
            })
        } else {
            reply(lvldata.xpLevelUp.message, channel, message, userData, lvldata);
        }
    }

    await lvlSchema2.findOneAndUpdate({ user: message.author.id, guild: message.guild.id }, {
        xp: userData.xp,
        level: userData.level,
        lastXP: Date.now()
    });
}

// Message Tracker
messagesSchema.findOne(
    { Guild: message.guild.id, User: message.author.id },
    async (err, data) => {
      if (data) {
        data.Messages += 1;
        data.save();

        messageRewards.findOne(
          { Guild: message.guild.id, Messages: data.Messages },
          async (err, data) => {
            if (data) {
              try {
                message.guild.members.cache
                  .get(message.author.id)
                  .roles.add(data.Role);
              } catch {}
            }
          }
        );
      } else {
        new messagesSchema({
          Guild: message.guild.id,
          User: message.author.id,
          Messages: 1,
        }).save();
      }
    }
  );

  //Economy Auction
  await client.AuctionCreateAndUpdate(message.guild.id);

  let database = await DarkAuction.findOne({ guild_id: message.guild.id });
 if(database) {
          /// Return went not enable!
          if (database.enable === false) return;

          /// Return went not find channel!
          let channel = await message.guild.channels.cache.get(database.channel_id);
          if (!channel) return;
  
          /// Check channel and return if not same
          if (database.channel_id != message.channel.id) return;
  
    //      if (message.author.id === client.user.id) {
    //          await delay(3000);
    //              message.delete()
    //          }
  
          /// Get message bot and return
          if (message.author.bot) return;
  
          /// Allow only numbers
              let content = message.cleanContent;
              await message.delete();
  
              //// Check if content is number not number and return
              if (isNaN(content)) return;
  
              const filters = [
                  "+",
                  "-"
              ];
      
              for (const message in filters) {
                  if (content.includes(filters[message])) {
                      message.channel.send(`${message.author} Hey you can't auction this value!`).then((msg) => { 
                          setTimeout(() => {
                              msg.delete()
                          }, 4000);
                      });
                      return;
                  }
              }
              //// Need bid higher than current price + 100,000 coins
              let price = parseInt(content);
  
              let member = await Member.findOne({ guild_id: message.guild.id, user_id: message.author.id });
  
              /// Not have enough coins
              if (member.money < price) {
                  message.channel.send(`${message.author} don't have enough money.`).then((msg) => { 
                      setTimeout(() => {
                          msg.delete()
                      }, 4000);
                  });
                  return;
              }
  
              const formatPrice = database.price * config.dark_auction.multiple;
  
              /// Need bid higher than current price + 100,000 coins Multiplied
              if (price < formatPrice) {
                  message.channel.send(`${message.author} need to bid higher than $${numberWithCommas(formatPrice)} Coins.`).then((msg) => { 
                      setTimeout(() => {
                          msg.delete()
                      }, 4000);
                  });
                  return;
              }
  
              /// Already bid
              if (database.bidder === message.author.id) {
                  message.channel.send(`${message.author} already bid need to another person outbid.`).then((msg) => { 
                      setTimeout(() => {
                          msg.delete()
                      }, 4000);
                  });
                  return;
              }
  
              /// Update database
              await database.updateOne({ price: price, bidder: message.author.id });
  
              //// Update history
              await DarkAuction.findOneAndUpdate({ guild_id: message.guild.id }, {
                  history: [...database.history, {
                      price: price,
                      bidder: message.author.id,
                  }],
              });
  
              /// Update member
              await member.updateOne({ money: member.money - price });
  
              ///  UpdateBidder Message
              await client.UpdateBidder(message.guild.id, message.author.id);
  
              //// Time left Auction
              if (database && database.ended) {
                  //// Find ended when true and run this handler
                  await client.DeleteChannel(message.guild.id);
              } else {
                  //// When false and return
                  return;
              }
 }


}


function reply(content, channel, message, userData, data, role) {
    if (!data.xpLevelUp.enable) return;

    channel.send({ content: content.replace(/{mention}/g, message.author.toString()).replace(/{level}/, userData.level).replace(/{xp}/, userData.xp).replace(/{role}/, role?.name).replace(/{userTag}/, message.author.tag).replace(/{user}/, message.author.username) });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

