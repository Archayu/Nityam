const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  const Schema = require("../../Models/Invites");


  module.exports = {
    name: ["invites", "reset-all"],
    description: "Reset All The Invites In The Guild",
    category: "Invites",
    options: [],
    permissions: {
      channel: [],
      bot: [],
      user: ["Administrator"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.reply({ content: "Wait Thinking..."});

const row = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
    .setCustomId("yes")
    .setLabel("Yes")
    .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
    .setCustomId("no")
    .setLabel("No")
    .setStyle(ButtonStyle.Success)

])


const Embed = new EmbedBuilder()
.setTitle("**⚠ Are You Sure You Want To Reset All Invites In The Guild**")
.setDescription("This Action Cannot Be Undone So Think About It")
.setColor("Red")


const message = await interaction.fetchReply();
const collector = interaction.channel.createMessageComponentCollector({ filter: (m) => m.user.id === interaction.user.id, time: 30000, max: 1 });
await message.edit({ content: " ", embeds: [Embed], components: [row] });

collector.on('collect', async (interaction) => {
    const id = interaction.customId;
    if(id === "yes") {
        Schema.deleteMany({ Guild: interaction.guild.id})

        await message.edit({ content: "Reseted All Invites Of The Guild", embeds: [], components: []})
    } else {
        return await  message.edit({ content: "Action Arborted", embeds: [], components: []})
    }

})


    },
  };
  