const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField
  } = require("discord.js");
  const delay = require("delay")
  module.exports = {
    name: ["filter", "earrape"],
    description: "Turning on the earrape filter",
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
        await interaction.deferReply({ ephemeral: false });;
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`There is nothing in the queue right now!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

        queue.setVolume(1000)

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`🔊\` | **Volume charge to:** \`Earrape\``);

        interaction.editReply({ content: ' ', embeds: [embed] })
    },
  };
  