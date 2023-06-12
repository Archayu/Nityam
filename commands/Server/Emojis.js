const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  module.exports = {
    name: ["server", "emojis"],
    description: "checkout the server emojis",
    category: "Server",
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
        await interaction.deferReply()
        let Emojis = "";
  let EmojisAnimated = "";
  let EmojiCount = 0;
  let Animated = 0;
  let OverallEmojis = 0;

  function Emoji(id) {
    return client.emojis.cache.get(id).toString();
  }

  interaction.guild.emojis.cache.forEach((emoji) => {
    OverallEmojis++;
    if (emoji.animated) {
      Animated++;
      EmojisAnimated += Emoji(emoji.id);
    } else {
      EmojiCount++;
      Emojis += Emoji(emoji.id);
    }
  });

  client.embed({
    title: `😛・Emoji's!`,
    desc: `${OverallEmojis} Emoji's - ${interaction.guild.name}`,
    fields: [
      {
        name: `Animated [${Animated}]`,
        value: EmojisAnimated.substr(0, 1021) + "...",
        inline: false,
      },
      {
        name: `Standard [${EmojiCount}]`,
        value: Emojis.substr(0, 1021) + "...",
        inline: false,
      },
    ],
    type: 'editreply'
  }, interaction)
    },
  };
  