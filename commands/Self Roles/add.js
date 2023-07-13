const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    CommandInteraction, 
    parseEmoji
  } = require("discord.js");
  const  client  = require("../../bot")
  const Schema =  require("../../Models/Self-Roles")
  
  module.exports = {
    name: ["self-roles", "add"],
    description: "Add role or Create Category Name For Your Self Roles Group",
    category: "Self Roles",
    options: [
        {
            name: "category",
            description: "create or add role in category in which want ",
            required:  true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: "role",
            description: "role for your self role",
            required:  true,
            type: ApplicationCommandOptionType.Role
        }, 
        {
            name: "emoji",
            description: "emoji of the role button",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    permissions: {
      channel: [],
      bot: ["ManageRoles"],
      user: ["ManageRoles", "ManageGuild"],
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
       * @param {client} client   
       */
    run: async (interaction, client) => {
        await interaction.deferReply();
        const category = interaction.options.getString('category');
        const role = interaction.options.getRole('role');
        const emoji = interaction.options.getString('emoji'); 
        const parsedEmoji = parseEmoji(emoji);
        if (!parsedEmoji) return client.errNormal({
            error: `Emoji not found in this server!`,
            type: 'editreply'
        }, interaction)
    
        Schema.findOne({ Guild: interaction.guild.id, Category: category }, async (err, data) => {
            if (data) {
                data.Roles[emoji] = [
                    role.id,
                    {
                        id: parsedEmoji.id,
                        raw: emoji
                    }
                ]
    
                await Schema.findOneAndUpdate({ Guild: interaction.guild.id, Category: category }, data)
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    Message: 0,
                    Category: category,
                    Roles: {
                        [emoji]: [
                            role.id,
                            {
                                id: parsedEmoji.id,
                                raw: emoji
                            }
                        ]
                    }
                }).save();
            }
    
            client.succNormal({ 
                text: "Reaction role successfully created! Create a panel in the following way",
                fields: [
                    {
                        name: `📘︙Menu panel`,
                        value: `\`/self-roles menu [category name]\``,
                        inline: true
                    },
                    {
                        name: `📘︙Button panel`,
                        value: `\`/self-roles button [category name]\``,
                        inline: true
                    }
                ],
                type: 'editreply'
            }, interaction);
        })


    },
  };
  