const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField
  } = require("discord.js");
  const { Database } = require("st.db");

  const GSetup = new Database("./Models/Json/setup.json", { databaseInObject: true });
  module.exports = {
    name: ["music", "seek"],
    description: "seek the song",
    category: "Music",
    options: [
      {
        name: "seconds",
        description: "The number of seconds to seek the timestamp by.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
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
      inVoice: true,
      isNSFW: false,
    },
    run: async (interaction, client) => {

      await interaction.deferReply({ ephemeral: false });
        
      const value = interaction.options.getInteger("seconds");
      
      const queue = client.distube.getQueue(interaction);
      if (!queue) return interaction.editReply(`There is nothing in the queue right now!`);
      const { channel } = interaction.member.voice;
      if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

      if(value >= queue.songs[0].duration || value < 0) return interaction.editReply(`Cannot seek beyond length of song.`);

      await queue.seek(value);

      const embed = new EmbedBuilder()
          .setDescription(`\`⏭\` | *Seeked to:* \`${value}\``)
          .setColor(client.color);

      interaction.editReply({ embeds: [embed] });
  },
};