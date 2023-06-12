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
    name: ["music", "volume"],
    description: "change the volume accordingly",
    category: "Music",
    options: [
      {
        name: "amount",
        description: "The amount of volume to set the bot to.",
        type: ApplicationCommandOptionType.Integer,
        required: false,
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

        const volume = interaction.options.getInteger("amount");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`There is nothing in the queue right now!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

        if (!volume) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Current **volume** : \`${queue.volume}\`%`)

            return interaction.editReply({ embeds: [embed] });
        }

        if (volume < 1 || volume > 200) return interaction.editReply(`Please provide a number between 1 and 200`)

        await client.distube.setVolume(interaction, volume);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`🔊\` | **Change volume to:** \`${volume}\`%`)

        interaction.editReply({ embeds: [embed] });
    },
  };
  