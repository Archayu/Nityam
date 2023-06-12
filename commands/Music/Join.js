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
    name: ["join"],
    description: "The Bot Will Join Your Voice Channel",
    category: "",
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
		if (queue) return interaction.editReply(`I already playing in voice channel.`);
		const { channel } = interaction.member.voice;
		if(!channel) return interaction.editReply(`You need to be in voice channel.`);

		await client.distube.voices.join(interaction.member.voice.channel);

		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setDescription(`\`🔊\` | **Joined:** \`${channel.name}\``)

		interaction.editReply({ embeds: [embed] });
    },
  };
  