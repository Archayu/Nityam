const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const messages = require("../../Resources/Structures/GiveawayMessages");
const ms = require("ms");
module.exports = {
  name: ["giveaway", "start"],
  description: "Start A Giveaway In the Guild",
  category: "Giveaways",
  options: [
    {
      name: "duration",
      description:
        "How long the giveaway should last for. Example values: 1m, 1h, 1d",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "winners",
      description: "How many winners the giveaway should have",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "prize",
      description: "What the prize of the giveaway should be",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "The channel to start the giveaway in",
      type: ApplicationCommandOptionType.Channel,
      required: true,
      channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    },
    {
      name: "bonusrole",
      description: "Role which would recieve bonus entries",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: "bonusamount",
      description: "The amount of bonus entries the role will recieve",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
    {
      name: "invite",
      description:
        "Invite of the server you want to add as giveaway joining requirement",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "role",
      description: "Role you want to add as giveaway joining requirement",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
  ],
  permissions: {
    channel: [],
    bot: [],
    user: ["ManageGuild"],
  },
  settings: {
    isPremium: false,
    isOwner: false,
    inVoice: false,
    isNSFW: false,
  },
  run: async (interaction, client) => {
    const giveawayChannel = interaction.options.getChannel("channel");
    const giveawayDuration = interaction.options.getString("duration");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");

    if(isNaN(ms(giveawayDuration))) {
        return interaction.reply({
          content: ':x: Please select a valid duration!',
          ephemeral: true
        });
      }
        if (giveawayWinnerCount < 1) {
          return interaction.reply({
            content: ':x: Please select a valid winner count! greater or equal to one.',
          })
        }
    
        const bonusRole = interaction.options.getRole('bonusrole')
        const bonusEntries = interaction.options.getInteger('bonusamount')
        let rolereq = interaction.options.getRole('role')
        let invite = interaction.options.getString('invite')
    
        if (bonusRole) {
          if (!bonusEntries) {
            return interaction.reply({
              content: `:x: You must specify how many bonus entries would ${bonusRole} recieve!`,
              ephemeral: true
            });
          }
        }
    
    
        await interaction.deferReply({ ephemeral: true })
        let reqinvite;
        if (invite) {
          let invitex = await client.fetchInvite(invite)
          let client_is_in_server = client.guilds.cache.get(
            invitex.guild.id
          )
          reqinvite = invitex
          if (!client_is_in_server) {
              const gaEmbed = {
                author: {
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL() 
                },
                title: "Server Check!",
                description:
                  `Hmm I See New Server In The Requirements Now Just Invite Me To That Server [Right Now!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot)`,
                timestamp: new Date(),
                footer: {
                  iconURL: client.user.displayAvatarURL(),
                  text: "Server Check"
                }
              }  
            return interaction.editReply({ embeds: [gaEmbed]})
          }
        }
    
        if (rolereq && !invite) {
          messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Only members having ${rolereq} are allowed to participate in this giveaway!`
        }
        if (rolereq && invite) {
          messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Only members having ${rolereq} are allowed to participate in this giveaway!\n- Members are required to join [this server](${invite}) to participate in this giveaway!`
        }
        if (!rolereq && invite) {
          messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Members are required to join [this server](${invite}) to participate in this giveaway!`
        }
    
    
        // start giveaway
        client.giveawaysManager.start(giveawayChannel, {
          // The giveaway duration
          duration: ms(giveawayDuration),
          // The giveaway prize
          prize: giveawayPrize,
          // The giveaway winner count
          winnerCount: parseInt(giveawayWinnerCount),
          // Hosted by
          hostedBy: interaction.user,
          // BonusEntries If Provided
          bonusEntries: [
            {
              // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
              bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
              cumulative: false
            }
          ],
          // Messages
          messages,
          extraData: {
            server: reqinvite == null ? "null" : reqinvite.guild.id,
            role: rolereq == null ? "null" : rolereq.id,
          }
        });
        interaction.editReply({
          content:
            `Giveaway started in ${giveawayChannel}!`,
          ephemeral: true
        })
    
        if (bonusRole) {
          let giveaway = new Discord.EmbedBuilder()
            .setAuthor({ name: `Bonus Entries Alert!` })
            .setDescription(
              `**${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!`
            )
            .setColor("Orange")
            .setTimestamp();
          giveawayChannel.send({ embeds: [giveaway] });
        }

  },
};
