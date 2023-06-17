const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField,
  } = require("discord.js");
  module.exports = {
    name: ["server", "role-info"],
    description: "get the role infor of the roles in the server",
    category: "Server",
    options: [
        {
            name: "role",
            description: "role to get info about",
            required: true,
            type: ApplicationCommandOptionType.Role
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
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        const role = interaction.options.getRole('role');
        const perms = new PermissionsBitField(role.permissions.bitfield).toArray();

        client.embed({
            title: `ℹ️・Role information`,
            thumbnail: interaction.guild.iconURL({ dynamic: true, size: 1024 }),
            desc: `Information about the role ${role}`,
            fields: [
              {
                name: 'Role ID:',
                value: `${role.id}`,
                inline: true
              },
              {
                name: 'Role Name:',
                value: `${role.name}`,
                inline: true
              },
              {
                name: 'Mentionable:',
                value: `${role.mentionable ? 'Yes' : 'No'}`,
                inline: true
              },
              {
                name: 'Role Permissions:',
                value: `${perms.join(', ')}`
              }
            ],
            type: 'reply'
          }, interaction)
    },
  };
  