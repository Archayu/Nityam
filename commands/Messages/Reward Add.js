const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  const Schema =  require("../../Models/MessageReward")
  module.exports = {
    name: ["messages", "rewards-add"],
    description: "add messages role reward",
    category: "Messages",
    options: [
        {
            name: "role",
            description: "role want to add",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: "messages",
            description: "messages on want to add role",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageRole", "ManageMessages"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply();
        const role = interaction.options.getRole("role"),
        messages = interaction.options.getNumber("messages")
        Schema.findOne({ Guild: interaction.guild.id, Messages: messages }, async (err, data) => {
            if (data) {
                return client.errNormal({ 
                    error: "This message amount already has a reward!",
                    type: 'editreply'
                }, interaction);
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    Messages: messages,
                    Role: role.id
                }).save();
    
                client.succNormal({ 
                    text: `Message reward created`,
                    fields: [
                        {
                            name: "📘︙Role",
                            value: `${role}`,
                            inline: true,
                        }
                    ],
                    type: 'editreply'
                }, interaction);
            }
        })
    },
  };
  