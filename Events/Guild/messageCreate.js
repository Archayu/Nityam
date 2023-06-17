
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
module.exports = async (client, message) => {
    if (message.author.bot) return;


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


}


function reply(content, channel, message, userData, data, role) {
    if (!data.xpLevelUp.enable) return;

    channel.send({ content: content.replace(/{mention}/g, message.author.toString()).replace(/{level}/, userData.level).replace(/{xp}/, userData.xp).replace(/{role}/, role?.name).replace(/{userTag}/, message.author.tag).replace(/{user}/, message.author.username) });
}

