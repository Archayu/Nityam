const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema = require("../../Models/InviteRewards")
  module.exports = {
    name: ["invites", "rewards-show"],
    description: "View The All Invite Rewards",
    category: "Invites",
    options: [],
    permissions: {
      channel: [],
      bot: [],
      user: [],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
await interaction.deferReply();
const rawLeaderboard = await Schema.find({ Guild: interaction.guild.id });

if (rawLeaderboard.length < 1) return client.errNormal({
    error: `No rewards found!`,
    type: 'editreply'
}, interaction);

const lb = rawLeaderboard.map(e => `**${e.Invites} messages** - <@&${e.Role}>`);

await client.createLeaderboard(`➕・Invites rewards - ${interaction.guild.name}`, lb, interaction);

    },
  };
  