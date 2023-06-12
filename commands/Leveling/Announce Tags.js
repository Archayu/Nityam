const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  module.exports = {
    name: ["level", "announce", "tags"],
    description: "Show the all tags of the level up announcement",
    category: "Leveling",
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
    run: async (interaction, client) => {
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("Tags Of The Announcement Messages")
        .addFields(
            {
                name: "{mention}", value: "ping the user", inline: true
            },
            {
                name: "{level}", value: "level of the user", inline: true
            },
            {
                name: "{xp}", value: "xp of the user", inline: true
            },
            {
                name: "{role}", value: "role reward that is given to user", inline: true
            },
            {
                name: "{userTag}", value: "username by tag like `Nityam#1234`", inline: true
            },
            {
                name: "{user}", value: "username of the user like `Nityam`", inline: true
            },
        )
        .setTimestamp()
        .setFooter({ text: client.footer, icon: client.user.displayAvatarURL()});
        interaction.reply({ embeds: [embed] });
        },
  };
  