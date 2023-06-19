const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionsBitField,
  } = require("discord.js");
  const ms = require("ms");
  module.exports = {
    name: ["timeout"],
    description: "timeout a user in a guild",
    category: "Moderation",
    options: [
        {
            name: "user",
            description: "user to timeout",
            type: ApplicationCommandOptionType.User,
            required: true,
    
        },
        {
            name: "time",
            description: "Time For Timeout user",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    permissions: {
      channel: [],
      bot: ["ManageGuild"],
      user: ["BanMembers", "ManageGuild"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {},
  };
  