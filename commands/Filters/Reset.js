const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField
  } = require("discord.js");
  const delay = require("delay")
  module.exports = {
    name: ["filter", "reset"],
    description: "reset all the filters",
    category: "Filters",
    options: [],
    permissions: {
      channel: [],
      bot: [],
      user: [],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: true,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`There is nothing in the queue right now!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

        queue.filters.clear();
        queue.setVolume(50)

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Filter has been: Reseted', iconURL: 'https://cdn.discordapp.com/emojis/758423098885275748.gif'})
            .setColor(client.color);

        await delay(3000);
        interaction.editReply({ content: ' ', embeds: [embed] });
    },
  };
  