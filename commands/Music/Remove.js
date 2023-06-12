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
    name: ["music", "remove"],
    description: "Remove the song from the queue",
    category: "Music",
    options: [
        {
            name: "position",
            description: "The position in queue want to remove.",
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

        const tracks = interaction.options.getInteger("position");
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`There is nothing in the queue right now!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

        if (tracks == 0) return interaction.editReply(`Cannot remove a song already playing.`);
        if (tracks > queue.songs.length) return interaction.editReply(`Song not found.`);

        const song = queue.songs[tracks];

        await queue.songs.splice(tracks, 1);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Removed • [${song.name}](${song.url})** \`${song.formattedDuration}\` • ${song.user}`)

        interaction.editReply({ content: " ", embeds: [embed] });
    },
  };
  