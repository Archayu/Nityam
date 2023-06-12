const {
    
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ImageFormat,
    ActionRowBuilder,
    
  } = require("discord.js");
  module.exports = {
    name: ["avatar"],
    description: "show the users avatar",
    category: "General",
    options: [
        {
            name: "user",
            required: false,
            type: ApplicationCommandOptionType.User,
            description: "user to show the avatar of",
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
    run: async (interaction, client) => {
        
        const user = interaction.options.getUser("user") || interaction.user;
//Must be one of: webp, png, jpg, jpeg, gif
        const jpg = new ButtonBuilder()
        .setLabel(`.JPG`)
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ size: 2048, extension: 'jpg'}))

        const jpeg = new ButtonBuilder()
        .setLabel(`.JPEG`)
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ size: 2048, extension: 'jpeg'}))

        const webp = new ButtonBuilder()
        .setLabel(`.WEBP`)
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ size: 2048, extension: 'webp'}))

        const png = new ButtonBuilder()
        .setLabel(`.PNG`)
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ size: 2048, extension: 'png'}))

        const gif = new ButtonBuilder()
        .setLabel(`.GIF`)
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ size: 2048, extension: 'gif'}))



        interaction.reply({ embeds: [
            new EmbedBuilder()
            .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}`, url: user.displayAvatarURL()})
            .setTitle(`Avatar of ${user.username}`)
            .setThumbnail(interaction.guild.iconURL())
            .setColor(client.color)
            .setImage(user.displayAvatarURL({ size: 4096, forceStatic: true}))
        ], 
      components: [new ActionRowBuilder().addComponents(jpeg, jpg, gif, webp, png)]})
     
    },
  };
  