const { EmbedBuilder} = require("discord.js"),
      { Manager } = require("nityam-giveaways"),
      Invites = require("../../Models/Invites"),
      Messages = require("../../Models/Messages"),
      Level = require("../../Models/User_Exp")


module.exports = async (client) => {

    class CustomManager extends Manager {
        GiveawayStartEmbed(giveaway) {
          let embed = new EmbedBuilder()
          .setTitle(`Nityam: Giveaway Started`)
          .setColor(client.color)
          .setDescription(`
          <:BulletPointOrange:1113397569725403179> Giveaway Details
          <:reply1:1113396597355724830> Prize: ${giveaway.prize}
          <:reply1:1113396597355724830> Ends In: <t:${Math.floor(giveaway.endTime / 1000)}:R>
          <:reply1:1113396597355724830> Winners: ${giveaway.winCount}
          <:reply:1113396624572567592>  Hosted By: ${giveaway.hostedBy}
          `)
          .setTimestamp(Date.now())
          return embed;
        }
        GiveawayEndNoWinnerEmbed(giveaway) {
          let embed = new EmbedBuilder()
          .setTitle(`Nityam: Giveway Ended But No One Joined`)
          .setDescription(`
          <:BulletPointOrange:1113397569725403179> Giveaway Details
          <:reply1:1113396597355724830> Prize: ${giveaway.prize}
          <:reply1:1113396597355724830> Ended At: <t:${Math.floor(Date.now() / 1000)}:R>
          <:reply1:1113396597355724830> Winners: ${giveaway.winCount}
          <:reply:1113396624572567592>  Hosted By: ${giveaway.hostedBy}
          `)
          .setColor(client.color)
          .setTimestamp(Date.now());
          return embed;
        }
        GiveawayEndWinnerEmbed(giveaway) {
          let embed = new EmbedBuilder()
          .setTitle(`Nityam: Giveway Ended`)
          .setColor(client.color)
          .setTimestamp(Date.now())
          .setDescription(`
          <:BulletPointOrange:1113397569725403179> Giveaway Details
          <:reply1:1113396597355724830> Prize: ${giveaway.prize}
          <:reply1:1113396597355724830> Ended At: <t:${Math.floor(Date.now() / 1000)}:R>
          <:reply1:1113396597355724830> Winners:  ${giveaway.winners
            .map((u) => `<@${u.userID}>`)
            .join(", ")}
          <:reply:1113396624572567592>  Hosted By: ${giveaway.hostedBy}
          `)
          return embed;
        }
      }
      
       client.giveaways = new CustomManager(client, {
        embedColor: client.color,
        pingEveryone: false,
        emoji: "🎁",
        level: Level,
        msg: Messages,
        inv: Invites
      });
}