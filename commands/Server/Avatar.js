const {
    
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ImageFormat,
  ActionRowBuilder,
  UserFlags
} = require("discord.js");
module.exports = {
  name: ["server", "avatar"],
  description: "show the Server Icon",
  category: "Server",
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
      
      const user = interaction.guild
//Must be one of: webp, png, jpg, jpeg, gif
      const jpg = new ButtonBuilder()
      .setLabel(`.JPG`)
      .setStyle(ButtonStyle.Link)
      .setURL(user.iconURL({ size: 2048, extension: 'jpg'}))

      const jpeg = new ButtonBuilder()
      .setLabel(`.JPEG`)
      .setStyle(ButtonStyle.Link)
      .setURL(user.iconURL({ size: 2048, extension: 'jpeg'}))

      const webp = new ButtonBuilder()
      .setLabel(`.WEBP`)
      .setStyle(ButtonStyle.Link)
      .setURL(user.iconURL({ size: 2048, extension: 'webp'}))

      const png = new ButtonBuilder()
      .setLabel(`.PNG`)
      .setStyle(ButtonStyle.Link)
      .setURL(user.iconURL({ size: 2048, extension: 'png'}))

      const gif = new ButtonBuilder()
      .setLabel(`.GIF`)
      .setStyle(ButtonStyle.Link)
      .setURL(user.iconURL({ size: 2048, extension: 'gif'}))



      interaction.reply({ embeds: [
          new EmbedBuilder()
          //.setAuthor({ name: `${user.username}`, iconURL: `${user.iconURL()}`, url: user.iconURL()})
          .setTitle(`Server of ${user.name}`)
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(client.color)
          .setImage(user.iconURL({ size: 4096, forceStatic: true}))
      ], 
    components: [new ActionRowBuilder().addComponents(jpeg, jpg, gif, webp, png)]})
   
  },
};
