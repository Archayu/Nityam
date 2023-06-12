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
    name: ["music", "skipto"],
    description: "skip the song to any from the queue",
    category: "Music",
    options: [
      {
        name: "position",
        description: "The position of the song in the queue.",
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

      const args = interaction.options.getInteger("position");

      const queue = client.distube.getQueue(interaction);
      if (!queue) return interaction.editReply(`There is nothing in the queue right now!`);
      const { channel } = interaction.member.voice;
      if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.");

      if ((args > queue.songs.length) || (args && !queue.songs[args])) return interaction.editReply("Song not found.");

      await client.distube.jump(interaction, args)
      
      const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`\`⏭\` | **Skipto:** ${args}`)

      interaction.editReply({ embeds: [embed] });
    },
  };
  