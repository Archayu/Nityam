const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  CommandInteraction,
  Client,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const Schema = require("../../Models/User_Exp");
const configs = require("../../Models/Leveling");
module.exports = {
  name: ["level", "reset-all"],
  description: "Reset The Level Of All Users In guild",
  category: "Leveling",
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
    sameVoice: false,
  },
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run: async (interaction, client) => {
    const data =
      (await configs.findOne({ id: interaction.guild.id })) ||
      (await configs.create({ id: interaction.guild.id }));

    if (!data.xp)
      return client.errNormal(
        {
          error: `Text Leveling System Is Disabled`,
          type: "ephemeral", //editreply, reply, update, ephemeraledit, ephemeral
        },
        interaction
      );
    await interaction.reply({ content: "Wait Thinking..." });

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("no")
        .setLabel("No")
        .setStyle(ButtonStyle.Success),
    ]);

    const Embed = new EmbedBuilder()
      .setTitle(
        "**⚠ Are You Sure You Want To Reset All Messages In The Guild**"
      )
      .setDescription("This Action Cannot Be Undone So Think About It")
      .setColor("Red");

    const message = await interaction.fetchReply();
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (m) => m.user.id === interaction.user.id,
      time: 30000,
      max: 1,
    });
    await message.edit({ content: " ", embeds: [Embed], components: [row] });

    collector.on("collect", async (interaction) => {
      const id = interaction.customId;
      if (id === "yes") {
        Schema.deleteMany({ guild: interaction.guild.id });

        await message.edit({
          content: "Reseted All Levels Of The Guild",
          embeds: [],
          components: [],
        });
      } else {
        return await message.edit({
          content: "Action Aborted",
          embeds: [],
          components: [],
        });
      }
    });
  },
};
