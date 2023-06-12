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
    name: ["music", "previous"],
    description: "play the previous song",
    category: "Music",
    options: [

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

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`There is nothing in the queue right now!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

        if (queue.previousSongs.length == 0) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`🚨\` | **There are no** `Previous` **songs**")

            interaction.editReply({ embeds: [embed] });
        } else { 
            await client.distube.previous(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`⏮\` | **Song has been:** `Previous`")

            interaction.editReply({ embeds: [embed] });
        }   
    },
  };
  